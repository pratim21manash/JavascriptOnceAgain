const App = () => {
  const checkPassword = () => {

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
                  width: '50%',
                  background: "red"
                }}
                className="h-full"
              />
           </div>
           <p className="font-semibold text-lg">Poor</p>
         </div>
      </div>
    </div>
  )
}

export default App