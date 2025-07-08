import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/entities/user.entity';

export class UserSeeder {
  static async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seeding...');
      return;
    }

    console.log('Seeding users...');

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const users = [
      {
        id: '1',
        name: 'Administrador General',
        email: 'admin@pns.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
        avatarUrl: null,
      },
      {
        id: '2',
        name: 'Director General',
        email: 'gerencia@pns.com',
        password: hashedPassword,
        role: UserRole.GERENCIA,
        isActive: true,
        avatarUrl: null,
      },
      {
        id: '3',
        name: 'Jefe de Recursos Humanos',
        email: 'rrhh@pns.com',
        password: hashedPassword,
        role: UserRole.RRHH,
        isActive: true,
        avatarUrl: null,
      },
      {
        id: '4',
        name: 'Especialista en Prevención',
        email: 'prevencion@pns.com',
        password: hashedPassword,
        role: UserRole.PREVENCION,
        isActive: true,
        avatarUrl: null,
      },
      {
        id: '5',
        name: 'Representante del Comité',
        email: 'comite@pns.com',
        password: hashedPassword,
        role: UserRole.COMITE,
        isActive: true,
        avatarUrl: null,
      },
      {
        id: '6',
        name: 'Supervisor de Operaciones',
        email: 'operaciones@pns.com',
        password: hashedPassword,
        role: UserRole.OPERACIONES,
        isActive: true,
        avatarUrl: null,
      },
    ];

    // Create users
    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Created user: ${userData.name} (${userData.email})`);
    }

    console.log('✅ Users seeded successfully!');
  }
}