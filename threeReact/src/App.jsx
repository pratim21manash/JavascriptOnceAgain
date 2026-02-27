import { BookOpen, Users, Star, PlayCircle, CheckCircle } from "lucide-react"
import "animate.css"
import { Tour } from "antd"
import { useRef, useState } from "react"

const App = () => {
  const [open, setOpen] = useState(true)

  const browseRef = useRef(null)
  const mentorRef = useRef(null)
  const courseRef = useRef(null)
  const enrollRef = useRef(null)

  const steps = [
    {
      title: "Browse Courses",
      description: "Start by exploring our top industry-ready courses.",
      target: () => browseRef.current,
    },
    {
      title: "Learn From Experts",
      description: "All courses are taught by experienced industry mentors.",
      target: () => mentorRef.current,
    },
    {
      title: "Select Your Course",
      description: "Pick the course that matches your career goals.",
      target: () => courseRef.current,
    },
    {
      title: "Enroll Instantly",
      description: "Click enroll and start your learning journey today.",
      target: () => enrollRef.current,
    },
  ]

  return (
    <div className="font-sans bg-gray-50 text-gray-800">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-md fixed w-full z-50">
        <h1 className="text-2xl font-bold text-indigo-600">CourseMaster</h1>
        <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <h1 className="text-5xl font-bold mb-6 animate__animated animate__fadeInDown">
          Upgrade Your Career With Practical Skills
        </h1>
        <p className="max-w-2xl text-lg mb-8 animate__animated animate__fadeInUp">
          Join thousands of students learning job-ready skills from top mentors.
        </p>
        <button
          ref={browseRef}
          className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:scale-105 transition animate__animated animate__pulse animate__infinite"
        >
          Browse Courses
        </button>
      </section>

      {/* Features */}
      <section className="py-20 px-8 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Students Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition">
            <BookOpen size={40} className="text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Project Based Learning</h3>
            <p>Build real-world applications and gain practical experience.</p>
          </div>

          <div
            ref={mentorRef}
            className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            <Users size={40} className="text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Expert Mentorship</h3>
            <p>Learn directly from professionals working in top companies.</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition">
            <Star size={40} className="text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">5-Star Rated Courses</h3>
            <p>Thousands of successful students trust our curriculum.</p>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 px-8 bg-gray-100">
        <h2 className="text-4xl font-bold text-center mb-12">
          Popular Courses
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div
            ref={courseRef}
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-xl font-semibold mb-4">
              MERN Stack Mastery
            </h3>
            <p className="text-gray-600 mb-4">
              Become a full stack developer with real-world projects.
            </p>
            <button
              ref={enrollRef}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Enroll Now
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              AI for Beginners
            </h3>
            <p className="text-gray-600">
              Start your journey in Artificial Intelligence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">
              Full Stack Django
            </h3>
            <p className="text-gray-600">
              Build scalable backend applications using Django.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-8 bg-white text-center">
        <h2 className="text-4xl font-bold mb-10">Simple Pricing</h2>

        <div className="max-w-md mx-auto bg-indigo-50 p-10 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Pro Plan</h3>
          <p className="text-4xl font-bold text-indigo-600 mb-6">₹4,999</p>

          <ul className="space-y-3 mb-6 text-left">
            <li className="flex gap-2"><CheckCircle size={18}/> All Courses Access</li>
            <li className="flex gap-2"><CheckCircle size={18}/> Lifetime Updates</li>
            <li className="flex gap-2"><CheckCircle size={18}/> Community Support</li>
          </ul>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
            Get Access
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white text-center py-6">
        © 2026 CourseMaster. All rights reserved.
      </footer>

      <Tour
        open={open}
        steps={steps}
        onClose={() => setOpen(false)}
        onFinish={() => setOpen(false)}
      />
    </div>
  )
}

export default App