import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { N8nService } from './n8n.service';

@ApiTags('n8n-automation')
@Controller('n8n')
export class N8nController {
  constructor(private readonly n8nService: N8nService) {}

  @Post('webhook/form-submission')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recibir webhook de envío de formulario' })
  @ApiResponse({ status: 200, description: 'Webhook procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos del webhook inválidos' })
  async handleFormSubmission(@Body() payload: any) {
    return this.n8nService.processWebhook(payload);
  }

  @Post('webhook/incident-report')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook para reportes de incidentes' })
  async handleIncidentReport(@Body() payload: any) {
    const formattedPayload = {
      ...payload,
      category: 'ISO45001',
      trigger: 'incident_report'
    };
    return this.n8nService.processWebhook(formattedPayload);
  }

  @Post('webhook/non-conformity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook para no conformidades' })
  async handleNonConformity(@Body() payload: any) {
    const formattedPayload = {
      ...payload,
      category: 'ISO9001',
      trigger: 'non_conformity'
    };
    return this.n8nService.processWebhook(formattedPayload);
  }

  @Post('webhook/environmental-event')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook para eventos ambientales' })
  async handleEnvironmentalEvent(@Body() payload: any) {
    const formattedPayload = {
      ...payload,
      category: 'ISO14001',
      trigger: 'environmental_event'
    };
    return this.n8nService.processWebhook(formattedPayload);
  }

  @Post('send-to-n8n')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar datos a n8n manualmente' })
  @ApiResponse({ status: 200, description: 'Datos enviados exitosamente' })
  @ApiResponse({ status: 502, description: 'Error de comunicación con n8n' })
  async sendToN8n(
    @Body() data: { webhookUrl: string; payload: any }
  ) {
    return this.n8nService.sendToN8n(data.webhookUrl, data.payload);
  }

  @Post('test-webhook')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Probar conexión a webhook n8n' })
  async testWebhook(@Body() data: { url: string }) {
    const isConnected = await this.n8nService.testWebhookConnection(data.url);
    return {
      url: data.url,
      connected: isConnected,
      timestamp: new Date().toISOString()
    };
  }

  @Get('automation-rules')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todas las reglas de automatización' })
  @ApiResponse({ status: 200, description: 'Lista de reglas de automatización' })
  async getAutomationRules() {
    return {
      rules: this.n8nService.getAutomationRules(),
      total: this.n8nService.getAutomationRules().length
    };
  }

  @Post('automation-rules')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva regla de automatización' })
  @ApiResponse({ status: 201, description: 'Regla creada exitosamente' })
  async createAutomationRule(@Body() rule: any) {
    return this.n8nService.createAutomationRule(rule);
  }

  @Put('automation-rules/:id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar regla de automatización' })
  @ApiResponse({ status: 200, description: 'Regla actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Regla no encontrada' })
  async updateAutomationRule(
    @Param('id') id: string,
    @Body() updates: any
  ) {
    return this.n8nService.updateAutomationRule(id, updates);
  }

  @Delete('automation-rules/:id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar regla de automatización' })
  @ApiResponse({ status: 200, description: 'Regla eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Regla no encontrada' })
  async deleteAutomationRule(@Param('id') id: string) {
    await this.n8nService.deleteAutomationRule(id);
    return {
      message: 'Automation rule deleted successfully',
      id
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Estado del sistema de automatización' })
  @ApiResponse({ status: 200, description: 'Estado del sistema' })
  async getSystemStatus() {
    const rules = this.n8nService.getAutomationRules();
    const enabledRules = rules.filter(rule => rule.enabled);
    
    return {
      status: 'operational',
      totalRules: rules.length,
      enabledRules: enabledRules.length,
      disabledRules: rules.length - enabledRules.length,
      categories: {
        ISO45001: rules.filter(r => r.category === 'ISO45001').length,
        ISO14001: rules.filter(r => r.category === 'ISO14001').length,
        ISO9001: rules.filter(r => r.category === 'ISO9001').length,
        HR: rules.filter(r => r.category === 'HR').length,
        Operations: rules.filter(r => r.category === 'Operations').length,
      },
      lastUpdated: new Date().toISOString()
    };
  }

  @Post('simulate-event')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Simular evento para testing' })
  @ApiResponse({ status: 200, description: 'Evento simulado exitosamente' })
  async simulateEvent(
    @Body() data: {
      eventType: 'incident' | 'non_conformity' | 'environmental';
      severity?: string;
      category?: string;
      customData?: any;
    }
  ) {
    const simulatedPayload = {
      formId: `sim-${Date.now()}`,
      formName: `Simulación ${data.eventType}`,
      category: this.getCategoryFromEventType(data.eventType),
      submittedBy: 'Sistema de Simulación',
      submissionDate: new Date().toISOString(),
      data: {
        severity: data.severity || 'Medio',
        simulation: true,
        ...data.customData
      }
    };

    return this.n8nService.processWebhook(simulatedPayload);
  }

  private getCategoryFromEventType(eventType: string): string {
    switch (eventType) {
      case 'incident':
        return 'ISO45001';
      case 'non_conformity':
        return 'ISO9001';
      case 'environmental':
        return 'ISO14001';
      default:
        return 'ISO45001';
    }
  }

  @Get('metrics')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Métricas del sistema de automatización' })
  @ApiResponse({ status: 200, description: 'Métricas del sistema' })
  async getMetrics(@Query('period') period: string = '30d') {
    // Simulación de métricas
    return {
      period,
      webhooksProcessed: 156,
      successfulExecutions: 142,
      failedExecutions: 14,
      averageProcessingTime: '1.2s',
      topTriggeredRules: [
        { name: 'Notificación Automática de Incidentes', executions: 45 },
        { name: 'Workflow de No Conformidades', executions: 38 },
        { name: 'Monitoreo Ambiental Automático', executions: 32 }
      ],
      executionsByCategory: {
        ISO45001: 67,
        ISO9001: 51,
        ISO14001: 38
      },
      timestamp: new Date().toISOString()
    };
  }

  @Post('bulk-process')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Procesamiento masivo de webhooks' })
  @ApiResponse({ status: 200, description: 'Procesamiento masivo completado' })
  async bulkProcess(@Body() data: { payloads: any[] }) {
    const results = [];
    
    for (const payload of data.payloads) {
      try {
        const result = await this.n8nService.processWebhook(payload);
        results.push({
          payload: payload.formId,
          success: true,
          result
        });
      } catch (error) {
        results.push({
          payload: payload.formId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return {
      total: data.payloads.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }
}