import {FC, useEffect, useRef, useState} from 'react'
import ContentLayout from '../components/ContentLayout';
import { DataProps, InvoiceCreationProps, invoiceType } from '../utils/types';
import { useReactToPrint } from 'react-to-print';

import { useGetInvoice } from '../utils/hooks';
import { Button } from 'antd';
import PrintOut from '../components/printOut';

const Invoice:FC = () => {

    const [fetching, setFetching] = useState(true)
    const [invoices, setInvoices] = useState<invoiceType[]>([])
    const [invoiceData, setInvoiceData] = useState<InvoiceCreationProps[]>([])
    const [canPrintOut, setCanPrintOut] = useState(false)

    const printOutRef = useRef<any>()
      
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Créé par',
        dataIndex: 'created_by_email',
        key: 'created_by_email',
      },
      {
        title: 'Boutique',
        dataIndex: 'shop_name',
        key: 'shop_name',
      },
      {
        title: 'Créé à',
        dataIndex: 'created_at',
        key: 'created_at',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
      },
    ];

    useGetInvoice(setInvoices, setFetching)

    const handlePrint = useReactToPrint({
      content: () => printOutRef.current,
    });

    const printData = (i:InvoiceCreationProps[]) => {
      setInvoiceData(i)
      setCanPrintOut(true)
    }

    useEffect(() => {
      if(canPrintOut){
        handlePrint()
        setCanPrintOut(false)
      }
    }, [canPrintOut]) 

    const pushActionToList = () => {
      return invoices.map(item => ({
        ...item,
        action: <Button onClick={() => printData(item.invoice_items)}>Imprimer</Button>
      }))
    }

    return (
        <>
          <ContentLayout
            pageTitle="Facture"
            dataSource={(pushActionToList() as unknown) as DataProps[]}
            columns={columns}
            fetching={fetching}
            disableAddButton
          />
          <div ref={printOutRef}>
            {canPrintOut && <PrintOut data={invoiceData}  />}
          </div>
        </>
    )
}


export default Invoice