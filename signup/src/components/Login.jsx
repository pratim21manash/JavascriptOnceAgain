import React from "react";

const Login = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
           <div className="bg-white p-8 rounded-xl shadow-lg w-96">
              <h1 className="text-2xl font-bold text-center mb-6">Login From</h1>

              <form className="space-y-4">
                <input 
                    type="email"
                    placeholder="plesae enter your email"
                    value={email}
                    className="w-full p-3 border rounded-lg"
                />

                <input 
                    type="password"
                    placeholder="please enter your Password here"
                    value={password}
                    className="w-full p-3 border rounded-lg"
                />

                <button type="submit" className="w-full bg-blue-500 p-3 rounded-lg hover:bg-blue-600">
                    Login
                </button>
              </form>
           </div>
        </div>
    )
}

export default Login;