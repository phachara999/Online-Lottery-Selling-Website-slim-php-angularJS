// To parse this data:
//
//   import { Convert } from "./file";
//
//   const data = Convert.toData(json);

export interface Data {
    ID:        number;
    date:      Date;
    total_bai: number;
    total:     number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toData(json: string): Data[] {
        return JSON.parse(json);
    }

    public static dataToJson(value: Data[]): string {
        return JSON.stringify(value);
    }
}
