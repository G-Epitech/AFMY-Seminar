import { Type } from "class-transformer";
import { IsDate } from "class-validator";

export class QueryGetStatisticsDTO {
  @IsDate()
  @Type(() => Date)
  public from: Date;

  @IsDate()
  @Type(() => Date)
  public to: Date;
}
