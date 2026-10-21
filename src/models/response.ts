export interface Response<DataType, ErrorType> {
  data: DataType | null;
  error: ErrorType | null;
}