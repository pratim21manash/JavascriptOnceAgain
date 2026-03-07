import { useState } from "react"

const App = () => {
  const [strength, setStrength] = useState({
    label: '',
    width: 0,
    color: ''
  })

  const checkPassword = (e) => {
    const password = e.target.value.trim()
    const lowLength = password.length < 6
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[@$!%?&]/.test(password)

    if (lowLength){
      setStrength({
        label: "Poor",
        width: '33%',
        color: 'red'
      })
      return
    }

    if (!lowLength && hasUpper && hasLower && hasNumber && hasSpecial) {
      setStrength({
        label: "Strong",
        width: "100%",
        color: 'green'
      })
      return
    }

    if (!lowLength && (hasUpper || hasNumber)){
      setStrength({
        label: "Average",
        width:'66%',
        color: 'yellow'
      })
      return
    }

    setStrength({
      label: "Poor",
      width: '33%',
      color: 'red'
    })
  }
   
  return (
    <div className="bg-gray-200 h-screen flex items-center justify-center">
      <div className="bg-white w-2xl shadow-lg p-8 rounded-xl space-y-5"> 
         <h1 className="text-3xl font-bold">Password Strength Checker</h1>
         <input 
            // type="password"
            className="border border-gray-300 rounded-lg p-3 w-full"
            placeholder="Enter your password here"
            onChange={checkPassword}
         />
         <div>
           <div className="bg-gray-200 w-full h-3 rounded overflow-hidden">
              <div 
                style={{
                  width: strength.width,
                  background: strength.color
                }}
                className="h-full transition "
              />
           </div>
           <p className="font-semibold text-lg">{strength.label}</p>
         </div>
      </div>
    </div>
  )
}

export default App