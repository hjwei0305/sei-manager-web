import React from 'react';

const Footer = () => (
  <div
    className="vertical"
    style={{ position: 'absolute', bottom: 16, textAlign: 'center', width: '100%' }}
  >
    <div style={{ margin: '0 auto' }}>
      四川虹信软件股份有限公司{' '}
      <a href="http://www.rcsit.cn" style={{ color: '#ccc6c6' }}>
        www.rcsit.cn
      </a>{' '}
      | Copyright © 2020
    </div>
    <div style={{ margin: '0 auto' }}>
      地址：四川省成都市高新区天府四街199号长虹科技大厦A-27 电话：4000-870-780
    </div>
  </div>
);

export default Footer;
