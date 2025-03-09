export type SortType = 'asc' | 'desc';
export type StatusType = 'all' | 'completed' | 'in-progress' | 'pending';
export type TaskActionType = 'create' | 'update' | 'view';
export type FieldValueType = {
  field: string;
  value: StatusType | SortType | string | null;
};

// task related types
export type Task = {
  id: number;
  title: string;
  status: 'In Progress' | 'Pending' | 'Completed';
  assigneeId: number;
};
export type TaskDetails = Task & {
  description?: string;
  dueDate?: Date;
};
export type TaskAction = {
  task: Task;
  action: TaskActionType;
};
export type Comment = {
  id: number;
  taskId: number;
  userId: number;
  text: string;
  createdAt: string;
};

export type PaginationTaskResponse = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: Task[];
};

// stats conf + types of the dashboard cmp
export type DashboardStats = {
  key: 'totalTasks' | 'completedTasks' | 'pendingTasks' | 'inProgressTasks';
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
};

export const statsConfig: StatConfig[] = [
  {
    key: 'totalTasks',
    title: 'Total Tasks',
    backgroundClass: 'bg-indigo',
    textClass: 'text-indigo',
    valueClass: 'text-indigo-dark',
  },
  {
    key: 'completedTasks',
    title: 'Completed',
    backgroundClass: 'bg-green',
    textClass: 'text-green',
    valueClass: 'text-green-dark',
  },
  {
    key: 'pendingTasks',
    title: 'Pending',
    backgroundClass: 'bg-amber',
    textClass: 'text-amber',
    valueClass: 'text-amber-dark',
  },
  {
    key: 'inProgressTasks',
    title: 'In Progress',
    backgroundClass: 'bg-blue',
    textClass: 'text-blue',
    valueClass: 'text-blue-dark',
  },
];


type StatConfig = {
  key: keyof DashboardStats;
  title: string;
  backgroundClass: string;
  textClass:string;
  valueClass:string;
  icon?: string;
  iconClass?: string;
};
