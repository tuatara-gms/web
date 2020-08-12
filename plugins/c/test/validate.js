// Custom Validator
const fun = val => val === '2012-01-01'
// Custom Validators Group
const PreConditionsArgs = [fun]
const PreConditions = { args: PreConditionsArgs }

// Invalid Validator
const InvalidOne = { foo: 'bar' }

// Invalid Date Validator
const IsDateString = { active: true }
const MinDate = { args: $nuxt.$moment('2011-01-01') }
const GetPromise = new Promise(async (resolve, reject) => {
  return await $nuxt.$axios
    .get('/foo')
    .then(() => {
      return resolve(true)
    })
    .catch(() => {
      return reject(false)
    })
})
const PassingPromise = {
  active: true,
  args: GetPromise
}

// Options Creation
const options = {
  PreConditions,
  InvalidOne,
  IsDateString,
  MinDate,
  PassingPromise
}
const instance = new $nuxt.$coc.Validator('2012-01-01', options)

// Validate
instance
  .Run()
  .then(() => {
    console.log('Success')
  })
  .catch(err => {
    console.log('Failed with ', err)
  })
