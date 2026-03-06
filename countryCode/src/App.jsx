import { Button, Form, Select, Typography, Divider, Space, Card, Alert } from "antd"
import { EnvironmentOutlined, GlobalOutlined, HomeOutlined, CheckCircleOutlined } from "@ant-design/icons"
import { useEffect } from "react"
import { useState } from "react"
import { GetCountries, GetState, GetCity } from "react-country-state-city"
import "antd/dist/reset.css"

const { Title, Text } = Typography

const App = () => {
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [submittedData, setSubmittedData] = useState(null)

  const getData = (values) => {
    setSubmittedData(values)
    console.log("Form Submitted:", values)
    // You can add your API call here
  }

  const loadCountries = async () => {
    setLoading(true)
    try {
      const countriesData = await GetCountries()
      const options = countriesData.map((country) => ({
        label: country.name,
        value: country.id, // Using id as value for better tracking
        name: country.name,
        id: country.id
      }))
      setCountries(options)
    } catch (error) {
      console.error("Error loading countries:", error)
    } finally {
      setLoading(false)
    }
  }

  const onCountrySelect = async (countryId, option) => {
    setSelectedCountry(option)
    setStates([])
    setCities([])
    form.setFieldsValue({ state: undefined, city: undefined })
    
    try {
      setLoading(true)
      const stateData = await GetState(countryId)
      const options = stateData.map((state) => ({
        label: state.name,
        value: state.id,
        name: state.name,
        id: state.id,
        countryId: countryId
      }))
      setStates(options)
    } catch (error) {
      console.error("Error loading states:", error)
    } finally {
      setLoading(false)
    }
  }

  const onStateSelect = async (stateId, option) => {
    setSelectedState(option)
    setCities([])
    form.setFieldsValue({ city: undefined })
    
    try {
      setLoading(true)
      const citiesData = await GetCity(option.countryId, stateId)
      const options = citiesData.map((city) => ({
        label: city.name,
        value: city.id,
        name: city.name
      }))
      setCities(options)
    } catch (error) {
      console.error("Error loading cities:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    form.resetFields()
    setStates([])
    setCities([])
    setSelectedCountry(null)
    setSelectedState(null)
    setSubmittedData(null)
  }

  useEffect(() => {
    loadCountries()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <Card 
        className="w-full max-w-lg shadow-2xl border-0 relative z-10 backdrop-blur-sm bg-white/90"
        bodyStyle={{ padding: "2rem" }}
      >
        {/* Header with Icons */}
        <div className="text-center mb-8">
          <Space direction="vertical" size="small" className="w-full">
            <div className="flex justify-center gap-2 text-3xl">
              <GlobalOutlined className="text-blue-500" />
              <EnvironmentOutlined className="text-green-500" />
              <HomeOutlined className="text-purple-500" />
            </div>
            <Title level={2} className="!mb-1 !text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Location Selector
            </Title>
            <Text type="secondary" className="text-base">
              Select your country, state, and city
            </Text>
          </Space>
        </div>

        <Divider className="!my-6 !bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={getData}
          size="large"
          className="space-y-4"
        >
          <Form.Item
            name="country"
            label={<Text strong className="text-gray-700">🌍 Country</Text>}
            rules={[{ required: true, message: "Please select your country" }]}
          >
            <Select
              placeholder="Choose your country"
              options={countries}
              showSearch
              optionFilterProp="label"
              loading={loading}
              onChange={onCountrySelect}
              allowClear
              className="w-full"
              size="large"
              dropdownStyle={{ borderRadius: "12px" }}
            />
          </Form.Item>

          <Form.Item
            name="state"
            label={<Text strong className="text-gray-700">🗺️ State</Text>}
            rules={[{ required: true, message: "Please select your state" }]}
          >
            <Select
              placeholder={selectedCountry ? `Select state in ${selectedCountry.name}` : "Select a country first"}
              options={states}
              showSearch
              optionFilterProp="label"
              loading={loading}
              onChange={onStateSelect}
              disabled={!selectedCountry}
              allowClear
              size="large"
              notFoundContent="No states available"
            />
          </Form.Item>

          <Form.Item
            name="city"
            label={<Text strong className="text-gray-700">🏙️ City</Text>}
            rules={[{ required: true, message: "Please select your city" }]}
          >
            <Select
              placeholder={selectedState ? `Select city in ${selectedState.name}` : "Select a state first"}
              options={cities}
              showSearch
              optionFilterProp="label"
              loading={loading}
              disabled={!selectedState}
              allowClear
              size="large"
              notFoundContent="No cities available"
            />
          </Form.Item>

          <Divider className="!my-6 !bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Form.Item className="flex-1 !mb-0">
              <Button 
                htmlType="submit" 
                type="primary" 
                size="large"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 border-0 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CheckCircleOutlined /> Submit Location
              </Button>
            </Form.Item>
            
            <Form.Item className="!mb-0">
              <Button 
                onClick={resetForm}
                size="large"
                className="border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
              >
                Reset
              </Button>
            </Form.Item>
          </div>
        </Form>

        {/* Success Message */}
        {submittedData && (
          <div className="mt-6 animate__animated animate__fadeInUp">
            <Alert
              message="Location Selected Successfully!"
              description={
                <div className="mt-2 space-y-1">
                  <p><strong>Country:</strong> {countries.find(c => c.value === submittedData.country)?.name || submittedData.country}</p>
                  <p><strong>State:</strong> {states.find(s => s.value === submittedData.state)?.name || submittedData.state}</p>
                  <p><strong>City:</strong> {cities.find(c => c.value === submittedData.city)?.name || submittedData.city}</p>
                </div>
              }
              type="success"
              showIcon
              closable
              onClose={() => setSubmittedData(null)}
              className="border-0 bg-green-50"
            />
          </div>
        )}
      </Card>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default App