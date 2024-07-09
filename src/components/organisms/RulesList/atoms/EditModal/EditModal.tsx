/* eslint-disable max-lines-per-function */
import React, { ReactElement, useEffect } from 'react'
import { Modal, Form, Button, Select, Input, Switch } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { filterSgName } from 'utils/filterSgName'
import { isCidrValid } from 'utils/isCidrValid'
import { Spacer } from 'components'
import { Styled } from './styled'

type TEditModalProps<T> = {
  direction: 'Ingress' | 'Egress'
  values: T | boolean
  hide: () => void
  edit: (values: T) => void
  isSg?: boolean
  isFqdn?: boolean
  isCidr?: boolean
  isPorts?: boolean
  isTransport?: boolean
  isIcmp?: boolean
  isTrace?: boolean
  defaultPrioritySome?: string
  isDisabled?: boolean
}

export const EditModal = <T,>({
  direction,
  values,
  hide,
  edit,
  isSg,
  isFqdn,
  isCidr,
  isPorts,
  isTransport,
  isIcmp,
  isTrace,
  defaultPrioritySome,
  isDisabled,
}: TEditModalProps<T>): ReactElement => {
  const [form] = Form.useForm()
  const sgNames = useSelector((state: RootState) => state.sgNames.sgNames)

  useEffect(() => {
    form.setFieldsValue(values)
  }, [values, form])

  const submit = () => {
    form
      .validateFields()
      .then(() => {
        const values: T = form.getFieldsValue()
        edit(values)
        hide()
      })
      // eslint-disable-next-line no-console
      .catch(() => console.log('Validating error'))
  }

  return (
    <Modal
      title={`Edit ${direction}`}
      open={typeof values !== 'boolean'}
      onOk={() => submit()}
      onCancel={() => {
        hide()
        form.resetFields()
      }}
      okText="Add"
      okButtonProps={{
        // TBD
        disabled: true,
      }}
    >
      <Spacer $space={16} $samespace />
      <Form form={form}>
        {isFqdn && (
          <Form.Item
            label="FQDN"
            name={['fqdn']}
            rules={[
              { required: true, message: 'Missing FQDN' },
              {
                pattern:
                  /(?=^.{1,253}$)(^(((?!-)[a-zA-Z0-9-]{1,63}(?<!-))|((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63})$)/,
                message: 'Please enter a valid FQDN',
              },
            ]}
          >
            <Input placeholder="FQDN" disabled />
          </Form.Item>
        )}
        {isCidr && (
          <Form.Item
            label="CIDR"
            name="cidr"
            rules={[
              { required: true, message: 'Missing CIDR' },
              () => ({
                validator(_, value: string) {
                  if (isCidrValid(value)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Please enter valid type'))
                },
              }),
            ]}
          >
            <Input placeholder="CIDR" disabled />
          </Form.Item>
        )}
        {isSg && (
          <Form.Item label="Groups" name={['sg']} rules={[{ required: true, message: 'Missing SG Name' }]}>
            <Select
              showSearch
              placeholder="Select SG"
              optionFilterProp="children"
              allowClear
              filterOption={filterSgName}
              options={sgNames.map(el => ({
                value: el,
                label: el,
              }))}
              getPopupContainer={node => node.parentNode}
              disabled
            />
          </Form.Item>
        )}
        {isPorts && (
          <Styled.PortsEditContainer>
            <Form.List name="ports">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Styled.PortFormItemsContainer key={key}>
                      <Form.Item {...restField} name={[name, 's']} label="Source">
                        <Input placeholder="Port source" disabled={isDisabled} />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'd']} label="Destination">
                        <Input placeholder="Port destination" disabled={isDisabled} />
                      </Form.Item>
                      <Button
                        type="dashed"
                        disabled={isDisabled}
                        onClick={() => remove(name)}
                        block
                        icon={<MinusOutlined />}
                      >
                        Remove ports
                      </Button>
                    </Styled.PortFormItemsContainer>
                  ))}
                  <Form.Item>
                    <Button disabled={isDisabled} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add ports
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Styled.PortsEditContainer>
        )}
        {isTransport && (
          <Form.Item
            name="transport"
            label="Transport"
            hasFeedback
            validateTrigger="onBlur"
            rules={[{ required: true, message: 'Please choose transport' }]}
          >
            <Select
              allowClear
              placeholder="Transport"
              options={[
                { label: 'TCP', value: 'TCP' },
                { label: 'UDP', value: 'UDP' },
              ]}
              getPopupContainer={node => node.parentNode}
              disabled={isDisabled}
            />
          </Form.Item>
        )}
        {isIcmp && (
          <>
            <Form.Item
              name="IPv"
              label="IPv"
              hasFeedback
              validateTrigger="onBlur"
              rules={[{ required: true, message: 'Please choose IPv' }]}
            >
              <Select
                allowClear
                placeholder="IPv"
                options={[
                  { label: 'IPv6', value: 'IPv6' },
                  { label: 'IPv4', value: 'IPv4' },
                ]}
                getPopupContainer={node => node.parentNode}
                disabled={isDisabled}
              />
            </Form.Item>
            <Form.Item
              label="Types"
              name="types"
              tooltip="Separator: space / coma"
              rules={[
                { required: true, message: 'Please choose type' },
                () => ({
                  validator(_, value: string[]) {
                    if (value.some(el => /^\b(?:1\d{2}|2[0-4]\d|[1-9]?\d|25[0-5])\b$/.test(el) === false)) {
                      return Promise.reject(new Error('Please enter valid type'))
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Select
                mode="tags"
                showSearch
                placeholder="Select types"
                optionFilterProp="children"
                allowClear
                tokenSeparators={[',', ' ']}
                getPopupContainer={node => node.parentNode}
                disabled={isDisabled}
                suffixIcon={null}
                // dropdownStyle={{ display: 'none' }}
                maxTagCount="responsive"
              />
            </Form.Item>
          </>
        )}
        <Form.Item valuePropName="checked" name="logs" label="Logs">
          <Switch disabled={isDisabled} />
        </Form.Item>
        {isTrace && (
          <Form.Item valuePropName="checked" name="trace" label="Trace">
            <Switch disabled={isDisabled} />
          </Form.Item>
        )}
        <Form.Item
          name="action"
          label="Action"
          hasFeedback
          validateTrigger="onBlur"
          rules={[{ required: true, message: 'Please choose action' }]}
        >
          <Select
            allowClear
            placeholder="Action"
            options={[
              { label: 'ACCEPT', value: 'ACCEPT' },
              { label: 'DROP', value: 'DROP' },
            ]}
            getPopupContainer={node => node.parentNode}
            disabled={isDisabled}
          />
        </Form.Item>
        <Form.Item
          name="prioritySome"
          label="Priority"
          hasFeedback
          validateTrigger="onBlur"
          rules={[
            {
              pattern: /^[-0-9]*$/,
              message: 'Please enter a valid priority',
            },
            () => ({
              validator(_, value: string) {
                if (value === undefined) {
                  return Promise.resolve()
                }
                const numberedValue = Number(value)
                if (Number.isNaN(numberedValue) || numberedValue > 32767 || numberedValue < -32768) {
                  return Promise.reject(new Error('Not in valid range'))
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <Input placeholder={defaultPrioritySome || 'priority.some'} disabled={isDisabled} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
