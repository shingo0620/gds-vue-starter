const tableReducer = (accumulator, current) => {
  return accumulator + current.metricID[0]
}

export { tableReducer }