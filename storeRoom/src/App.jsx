import React, { useState } from "react";
import "animate.css"
import { Button, Card, Form, Input, InputNumber, Modal, Select, Tag } from "antd";
import { Plus } from "lucide-react";
import { useStoreRoom } from "./zustand/useStoreRoom";
import { nanoid } from "nanoid";

const App = () => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const {stores, setStore} = useStoreRoom()

  const createItem = (values) => {
    values.id = nanoid()
    setStore(values)
  }

  const handleClose = () => {
    setOpen(false)
    form.resetFields()
  }

  return (
    <div className="bg-gray-200 min-h-screen py-12">
      <div className="w-10/12 bg-white rounded-4xl shadow-lg p-8 mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-600">🛍️Storeroom</h1>
          <div className="!space-x-3">
            <Input size="large" placeholder="search this store" className="!w-lg"/>
          </div>
          <Button onClick={()=>setOpen(true)} size="large" variant="solid" color="purple" icon={<Plus className="w-4 h-4"/>}>Add Item</Button>
        </div>

        <div className="grid grid-cols-4 gap-8">
            {
              stores.map((item, index)=>(
                <Card 
                  key={index} 
                  hoverable 
                  className="shadow-lg"
                  cover={
                    <img 
                      src="https://www.pngguru.in/storage/uploads/images/Laptop%20leather%20bag%20free%20png_1657476537_861128618.webp"
                      className="!w-40 !h-40 !object-cover mx-auto"
                    />
                  }
                >
                  <Card.Meta
                    title="Laptop cover"
                    description="1 PC"
                  />
                  <div className="flex mt-4 flex-wrap gap-3">
                    <Tag>Electronics</Tag>
                  </div>

                  <div className="mt-4 space-x-3">
                    <Button variant="solid" color="green">Edit</Button>
                    <Button variant="solid" color="pink">Delete</Button>
                  </div>
                </Card>
              ))
            }
        </div>
      </div>

      <Modal open={open} onCancel={handleClose} footer={null} title="Add Item">
        <Form onFinish={createItem} form={form}>
           <Form.Item
              name='title'
              rules={[{required: true}]}
           >
             <Input size="large" placeholder="Title"/>
           </Form.Item>

           <Form.Item
              name='quantity'
              rules={[{required: true, type: 'number'}]}
           >
            <InputNumber size="large" placeholder="Quantity" className="!w-full"/>
           </Form.Item>

           <Form.Item
              name="unitofMeasure"
              rules={[{required: true}]}
           >
             <Select 
              placeholder="Choose value"
              size="large"
              options={[
                {label: "PC", value: 'pc'},
                {label: "KG", value: 'kg'},
                {label: "LTR", value: 'ltr'},
                {label: "GM", value: 'am'}
              ]}
             />
           </Form.Item>

           <Form.Item
              name="keywords"
              rules={[{required: true}]}
           >
             <Select 
              placeholder="Enter keywords"
              size="large"
              mode="tags"
             />
           </Form.Item>

            <Form.Item
              name='image'
              rules={[{type: 'url'}]}
           >
             <Input size="large" placeholder="image url"/>
           </Form.Item>


           <Form.Item>
            <Button htmlType="submit" type="primary" size="large">Submit</Button>
           </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default App;