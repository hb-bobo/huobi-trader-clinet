import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Table, Button, message, Switch } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import { trade } from '@/api';

interface Props {}

const prefixCls = `auto-order`;

const periodOptions = [
  // {
  //   value: '1min',
  //   label: '1min',
  // },
  {
    value: '5min',
    label: '5min',
  },
  {
    value: '15min',
    label: '15min',
  },
  {
    value: '30min',
    label: '30min',
  },
  {
    value: '60min',
    label: '60min',
  },
  {
    value: '4hour',
    label: '4hour',
  },
  {
    value: '1day',
    label: '1day',
  },
];
const leverRateOptions = [
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 5,
    label: '5',
  },
];
const AutoOrder: React.FC<Props> = props => {
  const {} = props;
  const [autoOrderConfigList, setAutoOrderConfigList] = React.useState<any[]>(
    [],
  );

  useEffect(() => {
    getWatchSymbol();
  }, []);

  function getWatchSymbol() {
    trade.queryAutoContractOrder().then(data => {
      setAutoOrderConfigList(data);
    });
  }
  function postAutoOrder(postData: any) {
    if (!postData.id) {
      Object.assign(postData, {
        oversoldRatio: 0.03,
        overboughtRatio: -0.034,
        sellAmountRatio: 1.6,
        buyAmountRatio: 1.6,
        contract: false,
      });
    }
    trade.postAutoContractOrder(postData).then(data => {
      const newAutoOrderConfigList = [...autoOrderConfigList];
      const msg = postData.id ? '更新成功' : '提交成功';
      if (postData.id) {
        const index = newAutoOrderConfigList.findIndex(
          row => row.id === postData.id,
        );
        if (index > -1) {
          newAutoOrderConfigList[index] = {
            ...newAutoOrderConfigList[index],
            ...postData,
          };
        }
      } else {
        newAutoOrderConfigList.push({
          ...data,
        });
      }
      setAutoOrderConfigList(newAutoOrderConfigList);
      message.success(msg);
    });
  }
  const columns = [
    {
      title: 'symbol',
      key: 'symbol',
      dataIndex: 'symbol',
    },
    {
      title: '买入开多',
      key: 'buy_open',
      dataIndex: 'buy_open',
    },
    {
      title: '卖出平多',
      key: 'sell_close',
      dataIndex: 'sell_close',
    },
    {
      title: '卖出开空',
      key: 'sell_open',
      dataIndex: 'sell_open',
    },
    {
      title: '买入平空',
      key: 'buy_close',
      dataIndex: 'buy_close',
    },
    {
      title: 'period',
      key: 'period',
      dataIndex: 'period',
    },
    {
      title: '倍数',
      key: 'lever_rate',
      dataIndex: 'lever_rate',
    },
    {
      title: 'oversoldRatio',
      key: 'oversoldRatio',
      dataIndex: 'oversoldRatio',
    },
    {
      title: 'overboughtRatio',
      key: 'overboughtRatio',
      dataIndex: 'overboughtRatio',
    },
    {
      title: 'sellAmountRatio',
      key: 'sellAmountRatio',
      dataIndex: 'sellAmountRatio',
    },
    {
      title: 'buyAmountRatio',
      key: 'buyAmountRatio',
      dataIndex: 'buyAmountRatio',
    },
    {
      title: 'contract',
      key: 'contract',
      dataIndex: 'contract',
      render(text: string, record: any, index: number) {
        return <Switch checked={record.contract}></Switch>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any, index: number) => (
        <div key={index}>
          <ModalForm
            title="编辑"
            trigger={
              <Button type="primary">
                <PlusOutlined />
                编辑
              </Button>
            }
            modalProps={{
              onCancel: () => console.log('run'),
            }}
            onFinish={async values => {
              postAutoOrder({ ...values, id: record.id });
              return true;
            }}
            initialValues={{
              ...record,
            }}
          >
            <ProFormText width="s" name="symbol" label="symbol" />
            <ProFormDigit width="s" name="buy_open" label="买入开多" />
            <ProFormDigit width="s" name="sell_close" label="卖出平多" />
            <ProFormDigit width="s" name="sell_open" label="卖出开空" />
            <ProFormDigit width="s" name="buy_close" label="买入平空" />
            <ProFormSelect
              options={leverRateOptions}
              width="s"
              name="lever_rate"
              label="lever_rate"
            />
            <ProFormSelect
              options={periodOptions}
              width="s"
              name="period"
              label="period"
            />
            <ProFormText
              width="s"
              name="overboughtRatio"
              label="overboughtRatio"
            />
            <ProFormText width="s" name="oversoldRatio" label="oversoldRatio" />
            <ProFormText
              width="s"
              name="buyAmountRatio"
              label="buyAmountRatio"
            />
            <ProFormText
              width="s"
              name="sellAmountRatio"
              label="sellAmountRatio"
            />

            <ProFormSwitch name="contract" label="contract"></ProFormSwitch>
          </ModalForm>
          |
          <Button
            danger
            type="text"
            onClick={() => {
              trade.removeAutoOrder(record.id).then(data => {
                message.success('删除成功');
                getWatchSymbol();
              });
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className={classnames(prefixCls)}>
      <ModalForm
        title="新建表单"
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建表单
          </Button>
        }
        modalProps={{
          onCancel: () => console.log('run'),
        }}
        onFinish={async values => {
          postAutoOrder(values);
          return true;
        }}
        initialValues={{
          exchange: 'huobi',
          auto_trade: true,
        }}
      >
        <ProFormText width="s" name="symbol" label="symbol" />
        <ProFormDigit width="s" name="buy_open" label="买入开多" />
        <ProFormDigit width="s" name="sell_close" label="卖出平多" />
        <ProFormDigit width="s" name="sell_open" label="卖出开空" />
        <ProFormDigit width="s" name="buy_close" label="买入平空" />
        <ProFormSelect
          options={leverRateOptions}
          width="s"
          name="lever_rate"
          label="lever_rate"
        />
        <ProFormSelect
          options={periodOptions}
          width="s"
          name="period"
          label="period"
        />
        <ProFormText width="s" name="overboughtRatio" label="overboughtRatio" />
        <ProFormText width="s" name="oversoldRatio" label="oversoldRatio" />
        <ProFormText width="s" name="buyAmountRatio" label="buyAmountRatio" />
        <ProFormText width="s" name="sellAmountRatio" label="sellAmountRatio" />
      </ModalForm>
      <Table columns={columns} dataSource={autoOrderConfigList} />
    </div>
  );
};
export default AutoOrder;
