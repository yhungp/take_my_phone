export const callForContacts = (setFunction, dev) => {
  fetch("http://localhost:8080/list-contacts/" + dev)
  .then(res => res.json())
  .then(
    (result) => {
      if (result == null) {
        // setCount((count) => 0)
      }
      else {
        if (result !== "device offline") {
          setFunction(result)
        }
      }
    },
    (error) => {
      // setCount((i) => 0)
    }
  )
}

export const updateContacts = (setFunction, dev)  => {
  fetch("http://localhost:8080/update-contacts/" + dev)
  .then(res => res.json())
  .then(
    (result) => {
      if (result == null) {
        // setCount((count) => 0)
      }
      else {
        if (result !== "device offline") {
          setFunction(result)
        }
      }
    },
    (error) => {
      // setCount((i) => 0)
    }
  )
}

export const callForMessages = (setFunction, dev) => {
  fetch("http://localhost:8080/list-messages/" + dev)
  .then(res => res.json())
  .then(
    (result) => {
      if (result == null) {
        // setCount((count) => 0)
      }
      else {
        if (result !== "device offline") {
          setFunction(result)
        }
      }
    },
    (error) => {
      // setCount((i) => 0)
    }
  )
}