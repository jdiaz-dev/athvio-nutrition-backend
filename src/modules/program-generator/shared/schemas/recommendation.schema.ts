class Restriction {
  id: string;
  name: string;
}
export class Recommendation {
  id: string;
  name: string;
  details: string;
  restrictions: Restriction[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
