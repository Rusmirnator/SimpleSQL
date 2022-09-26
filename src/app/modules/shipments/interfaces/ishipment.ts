export interface IShipment {
    WMSObjectId: number,
    ShipNr: string,
    ArrivPeriodStartDT: Date,
    ArrivPeriodEndDT: Date,
    ArrivDT: Date,
    SupplyLetterNr: string,
    ShipType: number,
    FirmShortDesc: string,
    Ended: string,
    EndedDT: Date,
    ProcesDesc: string,
    ContrPercent: number,
    Color: string
}
