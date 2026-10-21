import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Diagram, TreeNode } from '../content/types';
import { renderInline } from '../lib/text';
import { Icon } from './Icon';
import { Modal } from './ui';

export function TreeView({ root, openDepth = 1 }: { root: TreeNode; openDepth?: number }) {
  return (
    <ul className="tree" role="tree">
      <TreeItem node={root} depth={0} openDepth={openDepth} />
    </ul>
  );
}

function TreeItem({ node, depth, openDepth }: { node: TreeNode; depth: number; openDepth: number }) {
  const hasKids = !!node.children?.length;
  const [open, setOpen] = useState(depth < openDepth);
  return (
    <li role="treeitem" aria-expanded={hasKids ? open : undefined} className={`tree-item depth-${Math.min(depth, 4)}`}>
      <div className="tree-row">
        {hasKids ? (
          <button type="button" className="tree-toggle" aria-label={`${open ? 'Collapse' : 'Expand'} ${node.label}`} onClick={() => setOpen((o) => !o)}>
            <Icon name="chevron" size={14} className={open ? 'rot' : ''} />
          </button>
        ) : (
          <span className="tree-dot" aria-hidden="true" />
        )}
        {node.to ? (
          <Link to={node.to} className="tree-label tree-link">
            {renderInline(node.label)}
          </Link>
        ) : (
          <span className="tree-label">{renderInline(node.label)}</span>
        )}
        {node.detail && <span className="tree-detail">{renderInline(node.detail)}</span>}
      </div>
      {hasKids && open && (
        <ul role="group">
          {node.children!.map((c, i) => (
            <TreeItem key={i} node={c} depth={depth + 1} openDepth={openDepth} />
          ))}
        </ul>
      )}
    </li>
  );
}

function MindMap({ d, startOpen }: { d: Extract<Diagram, { type: 'mindmap' }>; startOpen: boolean }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(startOpen ? d.branches.map((_, i) => i) : []));
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  const allOpen = open.size === d.branches.length;
  return (
    <div className="mindmap">
      <div className="mm-center">
        <span>{renderInline(d.center)}</span>
        <button type="button" className="btn btn-sm" onClick={() => setOpen(allOpen ? new Set() : new Set(d.branches.map((_, i) => i)))}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <ul className="mm-branches">
        {d.branches.map((b, i) => (
          <li key={i} className={`mm-branch tone-${i % 6}`}>
            <button type="button" aria-expanded={open.has(i)} onClick={() => toggle(i)} className="mm-branch-btn">
              <Icon name="chevron" size={14} className={open.has(i) ? 'rot' : ''} />
              <span>{renderInline(b.label)}</span>
            </button>
            {b.detail && open.has(i) && <p className="mm-detail">{renderInline(b.detail)}</p>}
            {open.has(i) && (
              <ul className="mm-items">
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DiagramBody({ d, startOpen = false }: { d: Diagram; startOpen?: boolean }) {
  switch (d.type) {
    case 'mindmap':
      return <MindMap d={d} startOpen={startOpen} />;
    case 'flow':
      return (
        <ol className="flow">
          {d.steps.map((s, i) => (
            <li key={i}>
              <div className="flow-step">
                <span className="flow-num">{i + 1}</span>
                <strong>{renderInline(s.label)}</strong>
                {s.detail && <span>{renderInline(s.detail)}</span>}
              </div>
            </li>
          ))}
        </ol>
      );
    case 'layers':
      return (
        <ol className="layers">
          {d.layers.map((l, i) => (
            <li key={i} className={`layer tone-${i % 6}`}>
              <strong>{renderInline(l.label)}</strong>
              {l.detail && <span>{renderInline(l.detail)}</span>}
            </li>
          ))}
        </ol>
      );
    case 'columns':
      return (
        <div className="dcols">
          {d.columns.map((c, i) => (
            <section key={i} className={`dcol tone-${i % 6}`}>
              <h5>{renderInline(c.heading)}</h5>
              <ul>
                {c.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      );
    case 'tree':
      return <TreeView root={d.root} openDepth={startOpen ? 99 : 2} />;
  }
}

export function DiagramCard({ d }: { d: Diagram }) {
  const [big, setBig] = useState(false);
  return (
    <figure className="diagram">
      <figcaption>
        <div>
          <strong>{d.title}</strong>
          {d.caption && <div className="muted small">{d.caption}</div>}
        </div>
        <button type="button" className="btn btn-sm" onClick={() => setBig(true)} aria-label={`Expand diagram: ${d.title}`}>
          <Icon name="expand" size={16} /> Expand
        </button>
      </figcaption>
      <div className="diagram-body">
        <DiagramBody d={d} />
      </div>
      {big && (
        <Modal title={d.title} wide onClose={() => setBig(false)}>
          <div className="diagram-big">
            <DiagramBody d={d} startOpen />
          </div>
          {d.caption && <p className="muted small">{d.caption}</p>}
        </Modal>
      )}
    </figure>
  );
}
