import React, { FC, useEffect, Dispatch, SetStateAction } from 'react'
import { Form, Select, Segmented } from 'antd'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { filterSgName } from 'utils/filterSgName'

type TSgSelectAndTypeSwitcherProps = {
  onSelectCenterSg: (value?: string) => void
  typeId: string
  subType: string
  onSelectSubType: Dispatch<SetStateAction<string>>
}

export const SgSelectAndTypeSwitcher: FC<TSgSelectAndTypeSwitcherProps> = ({
  onSelectCenterSg,
  typeId,
  subType,
  onSelectSubType,
}) => {
  const [form] = Form.useForm<{ name: string }>()
  const name = Form.useWatch<string>('name', form)

  const sgNames = useSelector((state: RootState) => state.sgNames.sgNames)

  useEffect(() => {
    onSelectCenterSg(name)
  }, [name, onSelectCenterSg])

  return (
    <>
      <Form<{ name: string }> form={form}>
        <Form.Item name="name">
          <Select
            showSearch
            allowClear
            placeholder="Select sg"
            optionFilterProp="children"
            filterOption={filterSgName}
            options={sgNames.map(el => ({
              value: el,
              label: el,
            }))}
          />
        </Form.Item>
      </Form>
      {typeId !== 'sgFqdn' && (
        <Segmented options={['TCP/UDP', 'ICMP']} value={subType} onChange={value => onSelectSubType(value as string)} />
      )}
    </>
  )
}
