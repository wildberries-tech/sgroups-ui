/* eslint-disable react/no-unstable-nested-components */
import React, { FC, Key, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from 'store/store'
import { setRulesSgFqdnTo } from 'store/editor/rulesSgFqdn/rulesSgFqdn'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import { TrashSimple, PencilSimpleLine } from '@phosphor-icons/react'
import { ShortenedTextWithTooltip, ThWhiteSpaceNoWrap } from 'components/atoms'
import { DEFAULT_PRIORITIES, STATUSES } from 'constants/rules'
import { TRulesTables, TFormSgFqdnRule } from 'localTypes/rules'
import { TextAlignContainer, TinyButton } from 'components'
import { EditModal } from '../../../atoms'
import { getRowSelection, getDefaultTableProps } from '../utils'
import { edit, remove, restore } from '../utils/editRemoveRestore/sgFqdn'
import { FilterDropdown, ActionCell, LogsCell, TransportCell, PortsCell } from '../atoms'
import { RULES_CONFIGS } from '../../../constants'
import { Styled } from '../styled'

type TSgFqdnTableProps = TRulesTables<TFormSgFqdnRule>

type TColumn = TFormSgFqdnRule & { key: string }

export const SgFqdnTable: FC<TSgFqdnTableProps> = ({
  direction,
  isChangesMode,
  rulesData,
  isDisabled,
  isRestoreButtonActive,
}) => {
  const dispatch = useDispatch()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
  const [editOpen, setEditOpen] = useState<TColumn | boolean>(false)

  const rulesSgFqdnTo = useSelector((state: RootState) => state.rulesSgFqdn.rulesTo)

  const rulesAll = direction === 'from' ? [] : rulesSgFqdnTo
  const setRules = direction === 'from' ? setRulesSgFqdnTo : setRulesSgFqdnTo

  const editRule = (oldValues: TFormSgFqdnRule, values: TFormSgFqdnRule) => {
    edit(dispatch, rulesAll, setRules, oldValues, values)
  }

  const removeRule = (oldValues: TFormSgFqdnRule) => {
    remove(dispatch, rulesAll, setRules, oldValues)
  }

  const restoreRule = (oldValues: TFormSgFqdnRule) => {
    restore(dispatch, rulesAll, setRules, oldValues)
  }

  const columns: ColumnsType<TColumn> = [
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 25,
      render: (_, { action, formChanges }) => <ActionCell action={action} formChanges={formChanges} />,
    },
    {
      title: 'Transport',
      dataIndex: 'transport',
      key: 'transport',
      width: 50,
      render: (_, { transport, formChanges }) => <TransportCell transport={transport} formChanges={formChanges} />,
      sorter: (a, b) => {
        if (a.transport === b.transport) {
          return 0
        }
        return a.transport === 'TCP' ? -1 : 1
      },
    },
    {
      title: 'FQDN',
      dataIndex: 'fqdn',
      key: 'fqdn',
      width: 150,
      render: (_, { fqdn, formChanges }) => (
        <Styled.RulesEntrySgs $modified={formChanges?.modifiedFields?.includes('fqdn')} className="no-scroll">
          <ShortenedTextWithTooltip text={fqdn} />
        </Styled.RulesEntrySgs>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <FilterDropdown
          setSelectedKeys={setSelectedKeys}
          selectedKeys={selectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          close={close}
          setSearchText={setSearchText}
        />
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
      onFilter: (value, { fqdn }) => fqdn.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Logs',
      dataIndex: 'logs',
      key: 'logs',
      width: 100,
      render: (_, { logs, formChanges }) => <LogsCell logs={logs} formChanges={formChanges} />,
      sorter: (a, b) => {
        if (a.logs === b.logs) {
          return 0
        }
        return a.logs ? -1 : 1
      },
    },
    {
      title: 'Priority',
      key: 'prioritySome',
      dataIndex: 'prioritySome',
      width: 25,
      render: (_, { prioritySome, formChanges }) => (
        <Styled.RulesEntryPorts $modified={formChanges?.modifiedFields?.includes('prioritySome')} className="no-scroll">
          {!!prioritySome || prioritySome === 0 ? prioritySome : DEFAULT_PRIORITIES.sgToFqdn}
        </Styled.RulesEntryPorts>
      ),
    },
    {
      title: 'Ports',
      key: 'ports',
      dataIndex: 'ports',
      width: 50,
      render: (_, { ports, formChanges }) => (
        <PortsCell ports={ports} changesMarker="ports" formChanges={formChanges} />
      ),
    },
    {
      title: '',
      key: 'controls',
      align: 'right',
      className: 'controls',
      width: 84,
      render: (_, oldValues) => (
        <TextAlignContainer $align="right" className="hideable">
          <TinyButton
            type="text"
            size="small"
            onClick={() => setEditOpen(oldValues)}
            icon={<PencilSimpleLine size={14} />}
          />
          {isRestoreButtonActive ? (
            <TinyButton
              type="text"
              size="small"
              onClick={() => restoreRule(oldValues)}
              icon={<TrashSimple size={14} />}
            />
          ) : (
            <TinyButton
              type="text"
              size="small"
              onClick={() => removeRule(oldValues)}
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
        key: `${row.fqdn}-${row.transport}`,
      }))
    : rulesData
        .filter(({ formChanges }) => formChanges?.status !== STATUSES.deleted)
        .map(row => ({
          ...row,
          key: `${row.fqdn}-${row.transport}`,
        }))

  const rowSelection = getRowSelection<TFormSgFqdnRule, TColumn>(
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
        <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection} {...defaultTableProps} />
      </ThWhiteSpaceNoWrap>

      <EditModal<TFormSgFqdnRule>
        direction={direction === 'from' ? 'Ingress' : 'Egress'}
        values={editOpen}
        hide={() => setEditOpen(false)}
        edit={values => {
          if (typeof editOpen !== 'boolean') {
            editRule(editOpen, values)
          }
        }}
        {...RULES_CONFIGS.sgFqdn}
        defaultPrioritySome={DEFAULT_PRIORITIES.sgToFqdn}
        isDisabled={isDisabled}
      />
    </>
  )
}
