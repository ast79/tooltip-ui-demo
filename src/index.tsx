// Distributed under the terms of the Modified BSD License.

import { Button, Tooltip } from '@jupyter/react-components';
import {
	JupyterFrontEnd,
	JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ReactWidget } from '@jupyterlab/ui-components';
import { Widget } from '@lumino/widgets';
import React from 'react';

//  Initialization data for the tooltip-ui-demo extension.
const plugin: JupyterFrontEndPlugin<void> = {
	id: 'tooltip-ui-demo:plugin',
	description: 'tooltip from jupyter-ui-demo extension in jupyter-ui-toolkit',
	autoStart: true,
	activate: (app: JupyterFrontEnd) => {
		console.log('JupyterLab extension tooltip-ui-demo is activated!');

		const widget = new Widget({ node: createNode() });
		widget.addClass('jp-Artwork');
		widget.id = 'artwork-ui-component';
		widget.title.label = 'Tooltip Demo';
		widget.title.closable = true;

		const reactWidget = ReactWidget.create(<Artwork />);
		reactWidget.addClass('jp-Artwork');
		reactWidget.id = 'artwork-react-ui-components';
		reactWidget.title.label = 'React Tooltip';
		reactWidget.title.closable = true;

		const eventListener = (name: string, emitAlert = false) => {
			const f = (event: Event) => {
				console.log('Event: ');
				console.log(event);
				if (emitAlert) {
					alert(`${name} event: ${event.type}`);
				}
			};
			return f;
		};

		const tooltip = widget.node.querySelector('jp-tooltip');
		tooltip?.addEventListener('dismiss', eventListener('Tooltip'));

		app.restored.then(() => {
			app.shell.add(widget, 'main');
			app.shell.add(reactWidget, 'main', { mode: 'split-right' });
			app.shell.activateById(widget.id);
		});
	}
};

function Artwork(): JSX.Element {
	const [tooltipAnchor, setTooltipAnchor] = React.useState<HTMLElement | null>(
		null
	);
	return (
		<div className="jp-Grid">
			<div className="jp-FlexColumn" style={{ gridColumn: 3 }}>
				<div className="jp-FlexColumn">
					<label>Tooltip</label>
					{/* Use callback ref to react to the component mount */}
					<Button
						ref={anchor => {
							setTooltipAnchor(anchor);
						}}
					>
						Anchor
					</Button>
					<Tooltip anchorElement={tooltipAnchor}>React tooltip</Tooltip>
				</div>
			</div>
		</div>
	);
}

function createNode(): HTMLElement {
	const node = document.createElement('div');
	node.insertAdjacentHTML(
		'afterbegin',
		`	  
<div class="jp-Grid">
  <div class="jp-FlexColumn" style="grid-column: 1;">
    <div class="jp-FlexColumn">
      <label>Tooltip</label>
      <jp-tooltip anchor="anchored-button">Beautiful tooltip</jp-tooltip>
      <jp-button id="anchored-button">Anchor</jp-button>
    </div>
  </div>
</div>
`
	);
	return node;
}

export default plugin;
