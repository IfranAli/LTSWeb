import { DaySegments, RepetitionType, WeekDay } from "../constants/constants";

export interface ScheduleSettings {
    startDate?: Date;
    endDate?: Date;
    restrictedToDays: WeekDay[];
    restrictedToDaySegment?: DaySegments[];
    repetitionType: RepetitionType;
}
