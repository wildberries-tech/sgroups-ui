/* eslint-disable no-console */
import React, { FC, useState, useEffect, Dispatch, SetStateAction } from 'react'
import { AxiosError } from 'axios'
import { Alert, Modal, Form, Input, Button, Typography, Select } from 'antd'
import { TrashSimple, Plus } from '@phosphor-icons/react'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import { addNetworks } from 'api/networks'
import { addSecurityGroup } from 'api/securityGroups'
import { isCidrValid } from 'utils/isCidrValid'
import { TNetworkWithSg, TNetworkForm } from 'localTypes/networks'
import { TSecurityGroup } from 'localTypes/securityGroups'
import { Spacer, FlexButton } from 'components'
import { Styled } from './styled'

type TNetworkAddModalProps = {
  externalOpenInfo: boolean
  setExternalOpenInfo: Dispatch<SetStateAction<boolean>>
  initNetworks: TNetworkWithSg[]
  setInitNetworks: Dispatch<SetStateAction<TNetworkWithSg[]>>
  options: TSecurityGroup[]
  setOptions: Dispatch<SetStateAction<TSecurityGroup[]>>
  openNotification?: (msg: string) => void
}

export const NetworkAddModal: FC<TNetworkAddModalProps> = ({
  externalOpenInfo,
  setExternalOpenInfo,
  openNotification,
  initNetworks,
  setInitNetworks,
  options,
  setOptions,
}) => {
  const [addForm] = Form.useForm<{ networks: TNetworkForm[]; securityGroup: string }>()
  const networks = Form.useWatch<TNetworkForm[]>('networks', addForm)
  const securityGroup = Form.useWatch<string>('securityGroup', addForm)
  const [error, setError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isOkButtonDisabled, setIsOkButtonDisabled] = useState<boolean>(true)

  useEffect(() => {
    setIsOkButtonDisabled(
      !networks ||
        networks.length === 0 ||
        networks.some(
          ({ name, CIDR }) => name === undefined || name.length === 0 || CIDR === undefined || CIDR.length === 0,
        ),
    )
  }, [networks])

  const openNwNotification = (isMany: boolean) => {
    if (openNotification) {
      openNotification(isMany ? 'Networks added' : 'Network added')
    }
  }

  const submit = () => {
    addForm
      .validateFields()
      .then(() => {
        setIsLoading(true)
        setError(undefined)
        addNetworks(networks)
          .then(() => {
            if (securityGroup) {
              const selectedSg = options.find(({ name }) => name === securityGroup)
              const selectedSgIndex = options.findIndex(({ name }) => name === securityGroup)
              if (selectedSg) {
                addSecurityGroup(
                  selectedSg.name,
                  selectedSg.defaultAction,
                  [...selectedSg.networks, ...networks.map(({ name }) => name)],
                  selectedSg.logs,
                  selectedSg.trace,
                )
                  .then(() => {
                    const newOptions = [...options]
                    newOptions[selectedSgIndex] = {
                      ...newOptions[selectedSgIndex],
                      networks: [...newOptions[selectedSgIndex].networks, ...networks.map(({ name }) => name)],
                    }
                    setOptions(newOptions)
                    setIsLoading(false)
                    setError(undefined)
                    setExternalOpenInfo(false)
                    addForm.resetFields()
                    openNwNotification(networks.length > 1)
                    setInitNetworks([
                      ...networks.map(({ name, CIDR }) => ({ name, network: { CIDR }, securityGroup })),
                      ...initNetworks,
                    ])
                  })
                  .catch((error: AxiosError<TRequestErrorData>) => {
                    setIsLoading(false)
                    if (error.response) {
                      setError({ status: error.response.status, data: error.response.data })
                    } else if (error.status) {
                      setError({ status: error.status })
                    } else {
                      setError({ status: 'Error occured while adding' })
                    }
                  })
              } else {
                setError({ status: 'Error while finding security group' })
              }
            } else {
              setIsLoading(false)
              setError(undefined)
              setExternalOpenInfo(false)
              addForm.resetFields()
              openNwNotification(networks.length > 1)
              setInitNetworks([
                ...networks.map(({ name, CIDR }) => ({ name, network: { CIDR }, securityGroup })),
                ...initNetworks,
              ])
            }
          })
          .catch((error: AxiosError<TRequestErrorData>) => {
            setIsLoading(false)
            if (error.response) {
              setError({ status: error.response.status, data: error.response.data })
            } else if (error.status) {
              setError({ status: error.status })
            } else {
              setError({ status: 'Error occured while adding' })
            }
          })
      })
      .catch(() => console.log('Validating error'))
  }

  return (
    <Modal
      title="Add Network"
      open={externalOpenInfo}
      onOk={() => submit()}
      onCancel={() => {
        setExternalOpenInfo(false)
        setIsLoading(false)
        setError(undefined)
        addForm.resetFields()
      }}
      okText="Add"
      confirmLoading={isLoading}
      okButtonProps={{
        disabled: isOkButtonDisabled,
      }}
    >
      <Spacer $space={16} $samespace />
      {error && (
        <Alert
          message={error.status}
          description={error.data ? `Code:${error.data.code}. Message: ${error.data.message}` : undefined}
          type="error"
          showIcon
          closable
        />
      )}
      <Styled.CustomLabelsContainer>
        <Typography.Text>
          Name<Typography.Text type="danger">*</Typography.Text>
        </Typography.Text>
        <Typography.Text>
          CIDR<Typography.Text type="danger">*</Typography.Text>
        </Typography.Text>
      </Styled.CustomLabelsContainer>
      <Form<{ networks: TNetworkForm[] }> form={addForm} initialValues={{ networks: [{ name: '', CIDR: '' }] }}>
        <Styled.ResetedFormList name="networks">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Styled.FormItemsContainer key={key}>
                  <Styled.ResetedFormItem
                    {...restField}
                    name={[name, 'name']}
                    hasFeedback
                    validateTrigger="onBlur"
                    rules={[
                      { required: true, message: 'Please input network name' },
                      () => ({
                        validator(_, value: string) {
                          if (!initNetworks.some(({ name }) => name === value)) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('Please enter unique name'))
                        },
                      }),
                    ]}
                  >
                    <Input placeholder="Enter name" size="large" allowClear />
                  </Styled.ResetedFormItem>
                  <Styled.ResetedFormItem
                    {...restField}
                    name={[name, 'CIDR']}
                    hasFeedback
                    validateTrigger="onBlur"
                    rules={[
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
                    <Input placeholder="Enter CIDR" size="large" allowClear />
                  </Styled.ResetedFormItem>
                  <Button
                    disabled={!networks || networks.length === 1}
                    type="text"
                    size="large"
                    onClick={() => remove(name)}
                    block
                    icon={<TrashSimple size={18} />}
                  />
                </Styled.FormItemsContainer>
              ))}
              <Styled.ResetedFormItem>
                <FlexButton
                  size="large"
                  type="dashed"
                  onClick={() => add({ name: '', CIDR: '' })}
                  block
                  icon={<Plus size={24} />}
                >
                  Add More
                </FlexButton>
              </Styled.ResetedFormItem>
            </>
          )}
        </Styled.ResetedFormList>
        <Spacer $space={16} $samespace />
        <Typography.Text>Security Group</Typography.Text>
        <Spacer $space={4} $samespace />
        <Styled.ResetedFormItem name="securityGroup" validateTrigger="onBlur">
          <Select
            options={options
              .map(({ name }) => ({ label: name, value: name }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            placeholder="Select security group"
            size="large"
            allowClear
          />
        </Styled.ResetedFormItem>
      </Form>
      <Spacer $space={20} $samespace />
    </Modal>
  )
}
