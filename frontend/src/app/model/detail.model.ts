// To parse this data:
//
//   import { Convert, Detail } from "./file";
//
//   const detail = Convert.toDetail(json);

export interface Detail {
    total:     number;
    total_bai: number;
    date:      String;
    price_lot: number[];
    number:    string[];
}
export interface Detail2 {
    total:     number;
    total_bai: number;
    date:      String;
    ID : number
}

// Converts JSON strings to/from your types
export class Convert {
    public static toDetail(json: string): Detail {
        return JSON.parse(json);
    }

    public static detailToJson(value: Detail): string {
        return JSON.stringify(value);
    }
    public static toDetail2(json: string): Detail2 {
        return JSON.parse(json);
    }

    public static detailToJson2(value: Detail2): string {
        return JSON.stringify(value);
    }
}
