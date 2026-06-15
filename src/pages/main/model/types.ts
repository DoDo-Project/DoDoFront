export interface MainPetProfile {
  petId: number;
  name: string;
  imageFileUrl: string | null;
  breed: string;
  age: number;
  species?: string;
  spercies?: string;
  sex: string;
  weight: number;
}

export interface MainHealthReport {
  petId: number;
  petName: string;
  dashboardId: number;
  healthReportTitle: string;
  healthReportSummary: string;
  healthReportContent: string;
  checkupDate: string;
}

export interface MainAnnouncement {
  boardTitle: string;
  boardContent: string;
  imageFileUrl: string | null;
  viewCount: number;
}

export interface MainHomeResponse {
  message: string;
  petProfiles: MainPetProfile[];
  healthReports: MainHealthReport[];
  announcement: MainAnnouncement[];
}
