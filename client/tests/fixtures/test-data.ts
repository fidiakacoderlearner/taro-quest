export const TEACHER = {
  email: 'teacher@taroquest.com',
  password: 'teacher123',
  name: 'Ms. Dyandra',
  role: 'teacher' as const,
};

export const STUDENT_DEMO = {
  email: 'student@taroquest.com',
  password: 'student123',
  name: 'Githa Sayang',
  role: 'student' as const,
};

export const STUDENT_NEW = {
  email: `test${Date.now()}@test.com`,
  password: 'test123',
  name: 'Test Student',
  classCode: 'DEMOAB',
  role: 'student' as const,
};

export const CLASS_CODE = 'DEMOAB';
export const CLASS_NAME = 'XI-A';

export const EVAL_ANSWERS: Record<string, number> = {
  'eval-1': 0,
  'eval-2': 1,
  'eval-3': 1,
  'eval-4': 2,
  'eval-5': 1,
};
