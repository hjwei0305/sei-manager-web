import React, { useState } from 'react';
import { get } from 'lodash';
import { Result, Modal } from 'antd';
import { BannerTitle, ExtIcon, PageLoader } from 'suid';
import styles from './ApiDoc.less';

const ApiDoc = ({ devBaseUrl, closeFormModal, currentModule, showModal }) => {
  const [loading, setLoad] = useState(true);

  const getDocUrl = () => {
    let url = '';
    if (devBaseUrl && currentModule) {
      url = `${devBaseUrl}/${get(currentModule, 'code')}/doc.html`;
    }
    return url;
  };

  const loaded = () => {
    setLoad(false);
  };

  const docUrl = getDocUrl();

  const openToBlank = () => {
    window.open(docUrl);
  };

  const renderTitle = () => {
    return (
      <>
        <ExtIcon onClick={closeFormModal} type="left" className="trigger-back" antd />
        <BannerTitle
          title={`${get(currentModule, 'name')}`}
          subTitle={
            <span>
              API Doc (<em>{docUrl}</em>
              <ExtIcon
                className="link-btn"
                tooltip={{ title: '独立窗口打开此文档', placement: 'bottom' }}
                onClick={openToBlank}
                type="link"
                antd
              />
              )
            </span>
          }
        />
      </>
    );
  };
  return (
    <Modal
      title={renderTitle()}
      destroyOnClose
      visible={showModal}
      centered
      onCancel={closeFormModal}
      closable={false}
      wrapClassName={styles['api-box']}
      footer={null}
    >
      {loading ? <PageLoader /> : null}
      {docUrl ? (
        <iframe
          title="api-doc"
          scrolling="auto"
          height="100%"
          width="100%"
          src={docUrl}
          onLoad={loaded}
          frameBorder="0"
        />
      ) : (
        <Result
          status="404"
          title="未发现有此文档"
          subTitle="抱歉, 当前模块没有文档信息，请检查路径是否正确"
        />
      )}
    </Modal>
  );
};

export default ApiDoc;
