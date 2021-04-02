import React, { useState } from 'react';
import { ExtIcon } from 'suid';

const MdEditorViewSwitch = props => {
  const [preview, setPreview] = useState(props.config.preview || false);
  const handleClick = () => {
    const html = !preview;
    setPreview(html);
    props.editor.setView({
      md: !html,
      html,
    });
  };

  return (
    <span onClick={handleClick} className="button">
      {preview ? (
        <ExtIcon type="edit" antd tooltip={{ title: '编辑', placement: 'bottom' }} />
      ) : (
        <ExtIcon type="eye" antd tooltip={{ title: '预览', placement: 'bottom' }} />
      )}
    </span>
  );
};

MdEditorViewSwitch.defaultConfig = {
  preview: false,
};
MdEditorViewSwitch.align = 'right';
MdEditorViewSwitch.pluginName = 'MdEditorViewSwitch';

export default MdEditorViewSwitch;
