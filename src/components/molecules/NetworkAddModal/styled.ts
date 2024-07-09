import styled from 'styled-components'
import { Form } from 'antd'

export const CustomLabelsContainer = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr 32px;
  margin-bottom: 4px;
`

export const FormItemsContainer = styled.div`
  display: grid;
  grid-column-gap: 8px;
  grid-template-columns: 1fr 1fr 32px;
  margin-bottom: 12px;
`

export const ResetedFormList = styled(Form.List)`
  margin-bottom: 0;
`

export const ResetedFormItem = styled(Form.Item)`
  margin-bottom: 0;
`

export const Styled = {
  CustomLabelsContainer,
  FormItemsContainer,
  ResetedFormList,
  ResetedFormItem,
}
