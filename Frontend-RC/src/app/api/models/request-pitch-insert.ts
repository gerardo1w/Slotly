export interface RequestPitchInsert {
  complexId: string;
  name: string;
  sport: 'Fútbol' | 'Tenis' | 'Básquet' | 'Pádel' | 'Vóley';
  pricePerHour: number;
  image: string;
  active: boolean;
}
