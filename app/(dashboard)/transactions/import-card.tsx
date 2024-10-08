import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react";
import ImportTable from "./import-table";
import { convertAmountToMili } from "@/lib/utils";
import { format, parse } from "date-fns";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormt = "yyyy-MM-dd";

const requiredOptions = [
    "amount",
    "date",
    "payee"
]

interface SelectedColumnsState {
    [key: string]: string | null
}

type Props = {
    data: string[][],
    onCancel: () => void,
    onSubmit: (data : any) =>void,
}

export default function ImportCard({
    data,
    onCancel,
    onSubmit
} : Props) {

    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>({});

    const headers = data[0];
    const body = data.slice(1);

    const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
        setSelectedColumns((prev)=> {
            const newSelectedColumns = {...prev}
            for (const key in newSelectedColumns) {
                if (newSelectedColumns[key] === value) {
                    newSelectedColumns[key] =null
                }
            }
            if (value === "skip")  value = null;
            newSelectedColumns[`column_${columnIndex}`] = value;
            return newSelectedColumns;
        })
    }
    const progress = Object.values(selectedColumns).filter(Boolean).length

    const handelContinue = () => {

        const mappedData = {
            headers: headers.map((_header, index)=> {
                return selectedColumns[`column_${index}`] || null
            }),
            body: body.map((row) => {
                const transformedRow = row.map((cell, index)=> {
                    return selectedColumns[`column_${index}`] ? cell : null
                })

                return transformedRow.every((item)=> item ===null) ? [] : transformedRow
            }).filter((row)=> row.length>0)
        }

        const arrayData = mappedData.body.map((row)=>{
            return row.reduce((acc: any, cell, index)=>{
                const header = mappedData.headers[index]
                if(header!==null) {acc[header] = cell}

                return acc
            }, {})
        })

        const formatedData = arrayData.map((item)=> ({
            ...item,
            amount: convertAmountToMili(parseFloat(item.amount)),
            date: format(parse(item.date, dateFormat, new Date()), outputFormt)
        }))
        
        onSubmit(formatedData)
    }

    return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">

        <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2  lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-3xl line-clamp-1">Import Transactions</CardTitle>

                <div className="flex items-center gap-x-2">
                  <Button onClick={onCancel} size='sm' className="w-full lg:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handelContinue} size='sm' className="w-full lg:w-auto" disabled={progress<requiredOptions.length}>
                    Continue ({progress} / {requiredOptions.length})
                  </Button>
                </div>
            </CardHeader>
            <CardContent>
            `   <ImportTable headers={headers} body={body} selectedColumns={selectedColumns} onTableHeadSelectChange={onTableHeadSelectChange}/>
            </CardContent>
        </Card>

</div>  )
}
