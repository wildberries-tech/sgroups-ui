/* eslint-disable max-lines-per-function */
/* eslint-disable react/no-unstable-nested-components */
import React, { FC, Key, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { setRulesSgCidrFrom, setRulesSgCidrTo } from 'store/editor/rulesSgCidr/rulesSgCidr'
import { Table, TableProps, notification } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { TrashSimple, PencilSimpleLine } from '@phosphor-icons/react'
import ipRangeCheck from 'ip-range-check'
import { DEFAULT_PRIORITIES, STATUSES } from 'constants/rules'
import { TRulesTables, TFormSgCidrRule } from 'localTypes/rules'
import {
  TextAlignContainer,
  TinyButtonInTableSmall,
  CustomMiddleSwitch,
  TableComponents,
  ShortenedTextWithTooltip,
  ThWhiteSpaceNoWrap,
} from 'components'
import { EditModal, DeleteOneModal } from '../../../atoms'
import { getRowSelection, getDefaultTableProps } from '../utils'
import { edit, remove, restore } from '../utils/editRemoveRestore/sgCidr'
import { ActionCell, PortsCell, StatusCell } from '../atoms'
import { RULES_CONFIGS } from '../../../constants'
import { Styled } from '../styled'

type TSgCidrTableProps = TRulesTables<TFormSgCidrRule>

type TColumn = TFormSgCidrRule & { key: string }

type OnChange = NonNullable<TableProps<TColumn>['onChange']>

type Filters = Parameters<OnChange>[1]

export const SgCidrTable: FC<TSgCidrTableProps> = ({
  direction,
  isChangesMode,
  rulesData,
  isDisabled,
  isRestoreButtonActive,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme)
  const [api, contextHolder] = notification.useNotification()
  const dispatch = useDispatch()
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [editOpen, setEditOpen] = useState<TColumn | boolean>(false)
  const [deleteOpen, setDeleteOpen] = useState<TFormSgCidrRule | boolean>(false)

  const searchText = useSelector((state: RootState) => state.searchText.searchText)
  const rulesSgCidrFrom = useSelector((state: RootState) => state.rulesSgCidr.rulesFrom)
  const rulesSgCidrTo = useSelector((state: RootState) => state.rulesSgCidr.rulesTo)

  const rulesAll = direction === 'from' ? rulesSgCidrFrom : rulesSgCidrTo
  const setRules = direction === 'from' ? setRulesSgCidrFrom : setRulesSgCidrTo
  const defaultTraffic = direction === 'from' ? 'Ingress' : 'Egress'

  useEffect(() => {
    setFilteredInfo({ name: searchText ? [searchText] : null })
  }, [searchText])

  useEffect(() => {
    if (!(rulesSgCidrFrom.some(el => el.checked === true) || rulesSgCidrTo.some(el => el.checked === true))) {
      setSelectedRowKeys([])
    }
  }, [rulesSgCidrFrom, rulesSgCidrTo])

  const openNotification = (msg: string) => {
    api.success({
      message: msg,
      placement: 'topRight',
    })
  }

  const editRule = (oldValues: TFormSgCidrRule, values: TFormSgCidrRule) => {
    edit(dispatch, rulesAll, setRules, defaultTraffic, oldValues, values, openNotification)
  }

  const removeRule = (oldValues: TFormSgCidrRule) => {
    remove(dispatch, rulesAll, setRules, oldValues, openNotification)
  }

  const restoreRule = (oldValues: TFormSgCidrRule) => {
    restore(dispatch, rulesAll, setRules, oldValues, openNotification)
  }

  const toggleLogs = (oldValues: TFormSgCidrRule, logs: boolean) => {
    edit(dispatch, rulesAll, setRules, defaultTraffic, oldValues, { ...oldValues, logs }, openNotification)
  }

  const toggleTrace = (oldValues: TFormSgCidrRule, trace: boolean) => {
    edit(dispatch, rulesAll, setRules, defaultTraffic, oldValues, { ...oldValues, trace }, openNotification)
  }

  const columns: ColumnsType<TColumn> = [
    ...(isChangesMode
      ? [
          {
            title: 'Status',
            dataIndex: 'formChanges',
            key: 'formChangesStatus',
            width: 100,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (_: any, values: TColumn) => <StatusCell status={values.formChanges?.status} />,
          },
        ]
      : []),
    {
      title: 'CIDR',
      dataIndex: 'cidr',
      key: 'cidr',
      render: (_, { cidr }) => (
        <Styled.RulesEntrySg className="no-scroll">
          <ShortenedTextWithTooltip text={cidr} />
        </Styled.RulesEntrySg>
      ),
      filteredValue: filteredInfo.name || null,
      onFilter: (value, { cidr }) =>
        ipRangeCheck(value as string, cidr) || cidr.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Priority',
      key: 'prioritySome',
      dataIndex: 'prioritySome',
      width: 160,
      render: (_, { prioritySome }) => {
        if (!!prioritySome || prioritySome === 0) {
          return prioritySome
        }
        return DEFAULT_PRIORITIES.sgToSg
      },
    },
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      width: 160,
      sorter: (a, b) => {
        if (a.transport === b.transport) {
          return 0
        }
        return a.transport === 'TCP' ? -1 : 1
      },
    },
    {
      title: 'Ports Source/Destination',
      key: 'ports',
      dataIndex: 'ports',
      width: 350,
      render: (_, { ports }) => <PortsCell ports={ports} />,
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 160,
      render: (_, { action }) => <ActionCell action={action} />,
    },
    {
      title: 'Logs',
      dataIndex: 'logs',
      key: 'logs',
      width: 160,
      render: (_, record) => (
        <CustomMiddleSwitch value={record.logs} onChange={checked => toggleLogs(record, checked)} />
      ),
      sorter: (a, b) => {
        if (a.logs === b.logs) {
          return 0
        }
        return a.logs ? -1 : 1
      },
    },
    {
      title: 'Trace',
      dataIndex: 'trace',
      key: 'trace',
      width: 160,
      render: (_, record) => (
        <CustomMiddleSwitch value={record.trace} onChange={checked => toggleTrace(record, checked)} />
      ),
      sorter: (a, b) => {
        if (a.trace === b.trace) {
          return 0
        }
        return a.trace ? -1 : 1
      },
    },
    {
      title: '',
      key: 'controls',
      align: 'right',
      className: 'controls',
      width: 84,
      render: (_, oldValues) => (
        <TextAlignContainer $align="right" className="hideable">
          <TinyButtonInTableSmall
            type="text"
            size="small"
            onClick={() => setEditOpen(oldValues)}
            icon={<PencilSimpleLine size={14} />}
          />
          {oldValues.formChanges?.status === 'deleted' && isRestoreButtonActive && (
            <TinyButtonInTableSmall
              type="text"
              size="small"
              onClick={() => restoreRule(oldValues)}
              icon={<TrashSimple size={14} />}
            />
          )}
          {oldValues.formChanges?.status !== 'deleted' && (
            <TinyButtonInTableSmall
              type="text"
              size="small"
              onClick={() => setDeleteOpen(oldValues)}
              icon={<TrashSimple size={14} />}
            />
          )}
        </TextAlignContainer>
      ),
    },
  ]

  const dataSource = isChangesMode
    ? rulesData.map(row => ({
        ...row,
        key: `${row.cidr.toLocaleString()}-${row.transport}`,
      }))
    : rulesData
        .filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted)
        .map(row => ({
          ...row,
          key: `${row.cidr.toLocaleString()}-${row.transport}`,
        }))

  const rowSelection = getRowSelection<TFormSgCidrRule, TColumn>(
    dispatch,
    isChangesMode,
    selectedRowKeys,
    dataSource,
    setRules,
    rulesAll,
    setSelectedRowKeys,
  )

  const defaultTableProps = getDefaultTableProps()

  return (
    <>
      <ThWhiteSpaceNoWrap>
        <TableComponents.TableContainerRules $isDark={theme === 'dark'}>
          <TableComponents.HideableControls>
            <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} {...defaultTableProps} />
          </TableComponents.HideableControls>
        </TableComponents.TableContainerRules>
      </ThWhiteSpaceNoWrap>
      <EditModal<TFormSgCidrRule>
        direction={direction === 'from' ? 'Ingress' : 'Egress'}
        values={editOpen}
        hide={() => setEditOpen(false)}
        edit={values => {
          if (typeof editOpen !== 'boolean') {
            editRule(editOpen, values)
          }
        }}
        {...RULES_CONFIGS.sgCidr}
        defaultPrioritySome={DEFAULT_PRIORITIES.sgToCidrIe}
        isDisabled={isDisabled}
      />
      <DeleteOneModal<TFormSgCidrRule>
        values={deleteOpen}
        hide={() => setDeleteOpen(false)}
        remove={() => {
          if (typeof deleteOpen !== 'boolean') {
            removeRule(deleteOpen)
          }
        }}
      />
      {contextHolder}
    </>
  )
}
