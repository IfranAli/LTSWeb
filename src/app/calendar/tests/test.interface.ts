export interface ITestData<T, V> {
  input: T,
  result: V,
}

export interface ITestDataSet<T, V> {
  data: ITestData<T, V>[],
}
