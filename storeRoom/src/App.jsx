import React, { useState } from "react";
import "animate.css"
import { Button, Card, Form, Input, InputNumber, Modal, Select, Tag, Typography, Empty } from "antd";
import { Plus, Search, Edit, Trash2, Package, Store } from "lucide-react";
import { useStoreRoom } from "./zustand/useStoreRoom";
import { nanoid } from "nanoid";

const { Title } = Typography;
const dummy = 'https://www.istockphoto.com/vector/no-photo-thumbnail-graphic-element-no-found-or-available-image-in-the-gallery-or-gm1980276924-558868016'

const App = () => {
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const {stores, setStore, deleteStore, updateStore} = useStoreRoom()
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')

  const createItem = (values) => {
    values.id = nanoid()
    setStore(values)
    handleClose()
  }

  const handleClose = () => {
    setOpen(false)
    setEditId(null)
    form.resetFields()
  }

  const editStore = (item) => {
    setEditId(item.id)
    setOpen(true)
    // Set form fields properly
    form.setFieldsValue({
      title: item.title,
      quantity: item.quantity,
      unitofMeasure: item.unitofMeasure,
      keywords: item.keywords,
      image: item.image
    })
  }

  const saveItem = (values) => {
    updateStore(editId, values)
    handleClose()
  }

  const handleSearch = (e) => {
    setSearch(e.target.value.trim().toLowerCase())
  }

  const filtered = stores.filter((item) =>
    item?.title?.toLowerCase().includes(search) ||
    item?.keywords?.some((keyword) =>
      keyword?.toLowerCase().includes(search)
    )
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="w-11/12 lg:w-10/12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Store className="w-10 h-10 text-blue-600" />
            <Title level={1} className="!mb-0 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Storeroom
            </Title>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Input
              onChange={handleSearch}
              size="large"
              placeholder="🔍 Search by title or keyword..."
              className="lg:w-96 rounded-full shadow-sm hover:shadow-md transition-shadow"
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              allowClear
            />
            <Button
              onClick={() => setOpen(true)}
              size="large"
              type="primary"
              className="bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:from-blue-700 hover:to-purple-700 shadow-lg rounded-full flex items-center gap-2"
              icon={<Plus className="w-4 h-4" />}
            >
              Add Item
            </Button>
          </div>
        </div>

        {/* Items Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <Card
                key={item.id}
                hoverable
                className="shadow-lg hover:shadow-2xl transition-all duration-300 border-none overflow-hidden group"
                cover={
                  <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
                    <img
                      src={item.image || dummy}
                      alt={item.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = dummy
                      }}
                    />
                  </div>
                }
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Title level={4} className="!mb-0 capitalize">
                      {item.title}
                    </Title>
                    <Tag color="blue" className="!rounded-full px-3">
                      <Package className="w-3 h-3 inline mr-1" />
                      {item.quantity} {item.unitofMeasure}
                    </Tag>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.keywords?.map((k, kIndex) => (
                      <Tag key={kIndex} className="!capitalize !rounded-full px-3 bg-gray-100 border-none">
                        {k}
                      </Tag>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button
                      onClick={() => editStore(item)}
                      className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                      icon={<Edit className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteStore(item.id)}
                      className="flex-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
                      icon={<Trash2 className="w-4 h-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Empty
            description={
              <span className="text-gray-500">
                {search ? "No items match your search" : "No items in storeroom yet"}
              </span>
            }
            className="py-12"
          >
            {search && (
              <Button onClick={() => setSearch('')} type="link">
                Clear search
              </Button>
            )}
          </Empty>
        )}
      </div>

      {/* Modal */}
      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        title={
          <Title level={3} className="!mb-0">
            {editId ? "✏️ Edit Item" : "➕ Add New Item"}
          </Title>
        }
        className="!rounded-2xl"
      >
        <Form
          onFinish={editId ? saveItem : createItem}
          form={form}
          layout="vertical"
          className="mt-6"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input size="large" placeholder="Enter item title" className="rounded-lg" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <InputNumber size="large" placeholder="Quantity" className="!w-full rounded-lg" />
            </Form.Item>

            <Form.Item
              name="unitofMeasure"
              label="Unit"
              rules={[{ required: true, message: "Please select unit" }]}
            >
              <Select
                placeholder="Select unit"
                size="large"
                className="rounded-lg"
                options={[
                  { label: "Pieces (PC)", value: 'pc' },
                  { label: "Kilogram (KG)", value: 'kg' },
                  { label: "Liter (LTR)", value: 'ltr' },
                  { label: "Gram (GM)", value: 'gm' }
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="keywords"
            label="Keywords"
            rules={[{ required: true, message: "Please enter at least one keyword" }]}
          >
            <Select
              placeholder="Enter keywords and press enter"
              size="large"
              mode="tags"
              className="rounded-lg"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image URL"
            rules={[{ type: 'url', message: "Please enter a valid URL" }]}
          >
            <Input size="large" placeholder="https://example.com/image.jpg" className="rounded-lg" />
          </Form.Item>

          <Form.Item className="!mb-0">
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              block
              className={`h-12 text-lg font-medium rounded-lg ${
                editId 
                  ? "bg-orange-500 hover:bg-orange-600" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              } border-none shadow-lg`}
            >
              {editId ? "Save Changes" : "Add to Storeroom"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default App;