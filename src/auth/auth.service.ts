import { Injectable } from '@nestjs/common';

export enum Role {
  ADMIN = 'ADMIN',       // Can POST and GET
  OPERATOR = 'OPERATOR', // Can POST only
  VIEWER = 'VIEWER',     // Can GET only
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  name: string;
}

@Injectable()
export class AuthService {
  // In-memory user storage (for demo purposes)
  private readonly users: User[] = [
    {
      id: 'user-a',
      username: 'user-a',
      password: 'password123',
      role: Role.OPERATOR,
      name: 'User A (Operator)',
    },
    {
      id: 'user-b',
      username: 'user-b',
      password: 'password123',
      role: Role.ADMIN,
      name: 'User B (Admin)',
    },
    {
      id: 'user-c',
      username: 'user-c',
      password: 'password123',
      role: Role.VIEWER,
      name: 'User C (Viewer)',
    },
  ];

  validateUser(username: string, password: string): User | null {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    return user || null;
  }

  getUserById(id: string): User | null {
    return this.users.find((u) => u.id === id) || null;
  }

  // Simple base64 token encoding (for demo - use JWT in production)
  generateToken(user: User): string {
    const payload = JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return Buffer.from(payload).toString('base64');
  }

  validateToken(token: string): { id: string; username: string; role: Role } | null {
    try {
      const payload = Buffer.from(token, 'base64').toString('utf-8');
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }
}
