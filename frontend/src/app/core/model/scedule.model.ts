interface SceduleSubject {
  _id: string;
  name: string;
}

export interface IScedule {
  _id: string;
  subject?: {
    [key: string]: SceduleSubject;
  };
  teacher?: string;
  classroom: string;
  type: string;
  beginDateTime: Date;
  endDateTime: Date;
}