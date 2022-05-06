import {
  Table as ChakraTable,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { BlockObject } from '../../lib/notion/types';
import { RichText } from './RichText';

export const Table: React.VFC<BlockObject> = (props) => {
  if (!props.has_children || props.type !== 'table') {
    return null;
  }

  const [head, ...body] = props.children;

  if (head.type !== 'table_row') {
    return null;
  }

  const TableHeader = props.table.has_column_header ? Th : Td;

  return (
    <TableContainer>
      <ChakraTable>
        <Thead>
          <Tr>
            {head.table_row.cells.map((x, i) => (
              <TableHeader
                key={`${head.id}-${i}`}
                bg={props.table.has_column_header && 'gray.50'}
              >
                <RichText richText={x} />
              </TableHeader>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {body.map((x) => (
            <TableRow
              key={x.id}
              {...x}
              has_row_header={props.table.has_row_header}
            />
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
};

const TableRow: React.VFC<BlockObject & { has_row_header: boolean }> = ({
  has_row_header,
  ...props
}) => {
  if (props.type !== 'table_row') {
    return null;
  }

  return (
    <Tr>
      {props.table_row.cells.map((x, i) =>
        i === 0 && has_row_header ? (
          <Th bg="gray.50">
            <RichText richText={x} />
          </Th>
        ) : (
          <Td>
            <RichText richText={x} />
          </Td>
        )
      )}
    </Tr>
  );
};
