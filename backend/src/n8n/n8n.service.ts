import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface WebhookPayload {
  formId: string;
  formName: string;
  category: string;
  submittedBy: string;
  submissionDate: string;
  data: Record<string, any>;
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

interface AutomationRule {
  id: string;
  name: string;
  category: 'ISO45001' | 'ISO14001' | 'ISO9001' | 'HR' | 'Operations';
  trigger: 'form_submit' | 'incident_report' | 'non_conformity' | 'environmental_event';
  conditions?: Record<string, any>;
  actions: Array<{
    type: 'webhook' | 'email' | 'notification' | 'database_update';
    config: Record<string, any>;
  }>;
  enabled: boolean;
}

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  private automationRules: AutomationRule[] = [];

  constructor(private configService: ConfigService) {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    this.automationRules = [
      {
        id: 'incident-auto-notify',
        name: 'Notificación Automática de Incidentes',
        category: 'ISO45001',
        trigger: 'incident_report',
        conditions: { severity: ['Alto', 'Crítico'] },
        actions: [
          {
            type: 'webhook',
            config: {
              url: this.configService.get('N8N_INCIDENT_WEBHOOK'),
              method: 'POST'
            }
          },
          {
            type: 'email',
            config: {
              recipients: ['prevencion@company.com', 'gerencia@company.com'],
              template: 'incident-notification'
            }
          }
        ],
        enabled: true
      },
      {
        id: 'nc-auto-workflow',
        name: 'Workflow de No Conformidades',
        category: 'ISO9001',
        trigger: 'non_conformity',
        actions: [
          {
            type: 'webhook',
            config: {
              url: this.configService.get('N8N_NC_WEBHOOK'),
              method: 'POST'
            }
          },
          {
            type: 'notification',
            config: {
              type: 'push',
              title: 'Nueva No Conformidad',
              message: 'Se ha reportado una nueva no conformidad'
            }
          }
        ],
        enabled: true
      },
      {
        id: 'env-monitoring',
        name: 'Monitoreo Ambiental Automático',
        category: 'ISO14001',
        trigger: 'environmental_event',
        conditions: { significance: ['Alto', 'Significativo'] },
        actions: [
          {
            type: 'webhook',
            config: {
              url: this.configService.get('N8N_ENV_WEBHOOK'),
              method: 'POST'
            }
          },
          {
            type: 'database_update',
            config: {
              table: 'environmental_metrics',
              action: 'insert'
            }
          }
        ],
        enabled: true
      }
    ];
  }

  async processWebhook(payload: WebhookPayload): Promise<any> {
    try {
      this.logger.log(`Processing webhook for form: ${payload.formName}`);

      // Encontrar reglas aplicables
      const applicableRules = this.automationRules.filter(rule => 
        rule.enabled && this.matchesRule(payload, rule)
      );

      const results = [];

      for (const rule of applicableRules) {
        this.logger.log(`Executing rule: ${rule.name}`);
        
        for (const action of rule.actions) {
          try {
            const result = await this.executeAction(action, payload);
            results.push({
              rule: rule.name,
              action: action.type,
              result,
              success: true
            });
          } catch (error) {
            this.logger.error(`Failed to execute action ${action.type} for rule ${rule.name}:`, error);
            results.push({
              rule: rule.name,
              action: action.type,
              error: error instanceof Error ? error.message : 'Unknown error',
              success: false
            });
          }
        }
      }

      return {
        processed: true,
        executedRules: results.length,
        results
      };

    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      throw new HttpException(
        'Failed to process webhook',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private matchesRule(payload: WebhookPayload, rule: AutomationRule): boolean {
    // Verificar categoría
    if (payload.category !== rule.category) {
      return false;
    }

    // Verificar condiciones específicas
    if (rule.conditions) {
      for (const [field, expectedValues] of Object.entries(rule.conditions)) {
        const actualValue = payload.data[field];
        if (Array.isArray(expectedValues)) {
          if (!expectedValues.includes(actualValue)) {
            return false;
          }
        } else if (actualValue !== expectedValues) {
          return false;
        }
      }
    }

    return true;
  }

  private async executeAction(action: any, payload: WebhookPayload): Promise<any> {
    switch (action.type) {
      case 'webhook':
        return this.executeWebhookAction(action.config, payload);
      
      case 'email':
        return this.executeEmailAction(action.config, payload);
      
      case 'notification':
        return this.executeNotificationAction(action.config, payload);
      
      case 'database_update':
        return this.executeDatabaseAction(action.config, payload);
      
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async executeWebhookAction(config: any, payload: WebhookPayload): Promise<any> {
    if (!config.url) {
      throw new Error('Webhook URL not configured');
    }

    const response = await axios({
      method: config.method || 'POST',
      url: config.url,
      data: {
        ...payload,
        timestamp: new Date().toISOString(),
        source: 'prevention-safety-platform'
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Prevention-Safety-Platform/1.0'
      },
      timeout: 10000
    });

    return {
      status: response.status,
      data: response.data
    };
  }

  private async executeEmailAction(config: any, payload: WebhookPayload): Promise<any> {
    // Simulación de envío de email
    this.logger.log(`Sending email to: ${config.recipients.join(', ')}`);
    this.logger.log(`Template: ${config.template}`);
    this.logger.log(`Subject: ${payload.formName} - ${payload.submittedBy}`);

    return {
      sent: true,
      recipients: config.recipients,
      template: config.template
    };
  }

  private async executeNotificationAction(config: any, payload: WebhookPayload): Promise<any> {
    // Simulación de notificación push
    this.logger.log(`Sending ${config.type} notification: ${config.title}`);
    
    return {
      sent: true,
      type: config.type,
      title: config.title,
      message: config.message
    };
  }

  private async executeDatabaseAction(config: any, payload: WebhookPayload): Promise<any> {
    // Simulación de actualización de base de datos
    this.logger.log(`Database ${config.action} on table: ${config.table}`);
    
    return {
      executed: true,
      table: config.table,
      action: config.action,
      affectedRows: 1
    };
  }

  async sendToN8n(webhookUrl: string, data: any): Promise<any> {
    try {
      const response = await axios.post(webhookUrl, {
        ...data,
        timestamp: new Date().toISOString(),
        source: 'prevention-safety-platform'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      this.logger.log(`Successfully sent data to n8n: ${webhookUrl}`);
      return response.data;

    } catch (error) {
      this.logger.error(`Failed to send data to n8n: ${webhookUrl}`, error);
      throw new HttpException(
        'Failed to communicate with n8n',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  getAutomationRules(): AutomationRule[] {
    return this.automationRules;
  }

  async createAutomationRule(rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule> {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };

    this.automationRules.push(newRule);
    this.logger.log(`Created new automation rule: ${newRule.name}`);
    
    return newRule;
  }

  async updateAutomationRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const ruleIndex = this.automationRules.findIndex(rule => rule.id === id);
    
    if (ruleIndex === -1) {
      throw new HttpException('Automation rule not found', HttpStatus.NOT_FOUND);
    }

    this.automationRules[ruleIndex] = {
      ...this.automationRules[ruleIndex],
      ...updates
    };

    return this.automationRules[ruleIndex];
  }

  async deleteAutomationRule(id: string): Promise<void> {
    const ruleIndex = this.automationRules.findIndex(rule => rule.id === id);
    
    if (ruleIndex === -1) {
      throw new HttpException('Automation rule not found', HttpStatus.NOT_FOUND);
    }

    this.automationRules.splice(ruleIndex, 1);
    this.logger.log(`Deleted automation rule: ${id}`);
  }

  async testWebhookConnection(url: string): Promise<boolean> {
    try {
      const response = await axios.post(url, {
        test: true,
        timestamp: new Date().toISOString(),
        source: 'prevention-safety-platform'
      }, {
        timeout: 5000
      });

      return response.status >= 200 && response.status < 300;
    } catch (error) {
      return false;
    }
  }
}