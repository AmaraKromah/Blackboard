interface AssignmentFile {
  _id: string;
  url: string;
  name: string;
}

export interface IAssignment {
  _id: string;
  title: string;
  description: string;
  type: string;
  file?: {
    [key: string]: AssignmentFile[];
  };
  filePaths?: string;
  subject?: Date;
  deadline: Date;
  send_at: Date;
  changed_at?: Date;
}
