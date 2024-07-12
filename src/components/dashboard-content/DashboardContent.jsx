import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input } from "antd";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import axios from "../../api";
import "./DashboardContent.scss";

const DashboardContent = ({ title, data, loading }) => {
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [form] = Form.useForm();

  const showEditModal = (product) => {
    setEditProduct(product);
    form.setFieldsValue(product);
    setOpenEditModal(true);
  };

  const handleEditOk = async () => {
    try {
      const updatedProduct = await form.validateFields();
      await axios.put(`/products/${editProduct._id}`, updatedProduct, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`
        }
      });
      location.reload();
    } catch (error) {
      console.log(error);
    }
    setOpenEditModal(false);
  };

  const handleDeleteOk = async () => {
    try {
      await axios.delete(`/products/${deleteProduct._id}`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`
        }
      });
      location.reload();
    } catch (error) {
      console.log(error);
    }
    setOpenDeleteModal(false);
  };

  const columns = [
    // Define your columns here
    {
      title: 'Actions',
      key: 'actions',
      render: (item) => (
        <div style={{ display: "flex", gap: 10 }}>
          <Button type="primary" danger onClick={() => setDeleteProduct(item)}>
            <BsFillTrashFill />
          </Button>
          <Space />
          <Button style={{ background: "gold", color: "#000" }} type="primary" onClick={() => showEditModal(item)}>
            <AiFillEdit />
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (data?.[0]) {
      const { __v, _id, password, ...rest } = data[0];
      setColumns(Object.keys({ ...rest, actions: "Delete" }).map((key) => ({
        title: key,
        dataIndex: key,
        key,
        width: key === "description" && 400,
        className: "td-item",
        render: (item) => {
          if (typeof item === "string" && item.startsWith("http")) {
            return <img width={50} data-td-item={key} src={item} />;
          } else {
            return <span data-td-item={key}>{item}</span>;
          }
        }
      })));
    }
  }, [data]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={data.map(item => ({ ...item, key: item._id, actions: item }))}
        loading={loading}
        scroll={{ x: 1300 }}
      />
      <Modal
        title={`Delete ${deleteProduct?.name}`}
        open={Boolean(deleteProduct)}
        onOk={handleDeleteOk}
        onCancel={() => setOpenDeleteModal(false)}
        okButtonProps={{ danger: true }}
      >
        Are you really going to delete this product?
      </Modal>
      <Modal
        title={`Edit ${editProduct?.name}`}
        open={Boolean(editProduct)}
        onOk={handleEditOk}
        onCancel={() => setOpenEditModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Please enter product name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Product Price" rules={[{ required: true, message: "Please enter product price" }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Product Description">
            <Input.TextArea />
          </Form.Item>
          {/* Add other form fields as necessary */}
        </Form>
      </Modal>
    </>
  );
};

export default DashboardContent;
