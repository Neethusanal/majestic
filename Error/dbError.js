module.exports = {
    handleDuplicate: (error) => {
      const value = error.keyValue.categoryName
  console.log(error, 'error');
      const message = `Duplicate field value: ${value}.Please use another value!`
  
      return message
    },



    coupenDuplicate: (error) => {
      const value = error.keyValue.coupenCode
  console.log(error,'coupon error');
      const message = `Duplicate field value: ${value}.Please use another value!`
  
      return message
    }
  }