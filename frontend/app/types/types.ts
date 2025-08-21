// app/types/types.ts veya ilgili dosya
export interface IMessage {
  id: number; // id?: number yerine bu şekilde olmalı
  sender: string;
  text: string;
}