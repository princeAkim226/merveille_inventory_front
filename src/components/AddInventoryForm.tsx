import {Form, Input, Select, Button, notification} from "antd"
import Modal from "antd/lib/modal/Modal"
import {FC, useState, useRef, ChangeEvent} from "react"
import { axiosRequest } from "../utils/functions"
import { DataProps, FormModalProps, GroupProps } from "../utils/types"
import { CloudinaryUrl, InventoryUrl } from "../utils/network"
import ImageHolder from "../assets/imageHolder.png"

const {Option} = Select

interface AddInventoryFormProps extends FormModalProps {
    groups:GroupProps[]
}

const AddInventoryForm:FC<AddInventoryFormProps> =  ({
    isVisible = false,
    onSuccessCallBack,
    onClose,
    groups
}) => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>()

    const fileSelect = useRef<HTMLInputElement>(null)

    const onSubmit = async (values: DataProps) => {
        setLoading(true)

        if(imageUrl){
            values = {...values, photo:imageUrl}
        }

        const response = await axiosRequest({
            method:"post",
            url: InventoryUrl,
            hasAuth: true,
            payload: values
        })
        setLoading(false)

        if(response){
            notification.success({
                message:"Operation Success",
                description: "Inventory Item created successfully"
            })
            onSuccessCallBack()
            form.resetFields()
            setImageUrl(null)
        }
    }

    const handleFileChange = async (e:ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const formItem = new FormData()
            formItem.append("file", e.target.files[0])
            formItem.append("upload_preset", "inventory_app")
            formItem.append("tags", "inventory_app")

            setLoading(true)

            const response = await axiosRequest<{url: string}>({
                method:"post",
                url: CloudinaryUrl,
                payload: formItem
            })
            setLoading(false)
            if(response){
                setImageUrl(response.data.url)
            }
        }
    }

    return (
        <Modal 
            title="Ajouter un article d'inventaire" 
            visible={isVisible} 
            onCancel={onClose}
            footer={false}
            maskClosable={false}
            >
            <Form layout="vertical" onFinish={onSubmit} form={form}>
                <Form.Item
                    label="Photo"
                >
                    <div 
                        className="imageView" 
                        onClick={() => !loading && fileSelect.current?.click()}  
                        style={{
                            backgroundImage: `url(${imageUrl ? imageUrl : ImageHolder})`
                        }}
                    />
                    <input 
                        type="file" 
                        style={{display:"none"}} 
                        ref={fileSelect} 
                        onChange={handleFileChange} />
                </Form.Item>
                <Form.Item 
                    label="Nom"
                    name="name"
                    rules={[{ 
                        required: true, 
                        message: 'Please input group name!' }]}
                    >
                    <Input placeholder="Nom de l'article"/>
                </Form.Item>
                <Form.Item 
                    label="Nombre"
                    name="total"
                    rules={[{ 
                        required: true, 
                        message: "Veuillez entrer le nombre d'articles" }]}
                    >
                    <Input placeholder="Item count" type="number" min={1} />
                </Form.Item>
                <Form.Item 
                    label="Prix Individuel (F CFA)"
                    name="price"
                    rules={[{ 
                        required: true, 
                        message: "Veuillez fournir le prix individuel de l'article !" }]}
                    >
                    <Input placeholder="Prix ​​de l'article" type="number" min={1} />
                </Form.Item>
                <Form.Item 
                    label="Groupe/Catégorie"
                    name="group_id"
                    >
                    <Select defaultValue="">
                        <Option value="">Sélectionnez un groupe</Option>
                        {
                            groups.map(
                                (item, index) => 
                                <Option value={item.id} key={index}>{item.name}</Option>)
                        }
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary" block loading={loading}>Soumettre</Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddInventoryForm