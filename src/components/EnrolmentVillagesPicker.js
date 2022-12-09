import React, { useEffect, useState } from "react";
import { withModulesManager, combine, useTranslations, PublishedComponent } from "@openimis/fe-core";
import DeleteIcon from "@material-ui/icons/Delete";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import {
  TableContainer,
  TableHead,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableFooter,
  Paper,
  Button,
  IconButton,
} from "@material-ui/core";
import { fetchDataFromDistrict, clearDistrictData } from "../actions";

const styles = (theme) => ({
  footer: {
    marginInline: 16,
    marginBlock: 12,
  },
  headerTitle: theme.table.title,
  actionCell: {
    width: 60,
  },
  header: theme.table.header,
});

const groupVillagesByMunicipality = (villages) => {
  const result = [];
  villages?.forEach((village) => {
    if (!result.find((x) => x.parent?.id === village.parent.id)) {
      result.push({ parent: village.parent, entities: [] });
    }

    result.find((x) => x.parent?.id === village.parent.id).entities.push(village);
  });

  result.sort((a, b) => (a.parent ? a.parent.id > b.parent?.id : -1));
  return result;
};

const EnrolmentVillagesPicker = (props) => {
  const { location, modulesManager, readOnly, villages, onChange, classes, districts, isOfficerPanelEnabled } = props;
  const [items, setItems] = useState([]);
  const { formatMessage } = useTranslations("admin.EnrolmentZonesPicker", modulesManager);
  const pickedDistrictsUuids = districts && districts.map((district) => district.uuid);
  const dispatch = useDispatch();
  const data = useSelector((state) => state.admin.dst_mun_vil);
  const fetchedDistrictDataFlag = useSelector((state) => state.admin.fetched_dst_mun_vil);

  const handleChange = (newItems) => {
    const villageIds = newItems.reduce((acc, item) => (item.entities ? acc.concat(item.entities) : acc), []);
    onChange(villageIds);
  };

  const onRemoveRow = (row) => {
    handleChange(items.filter((i) => i.parent?.id !== row.parent?.id));
  };

  useEffect(() => {
    setItems(groupVillagesByMunicipality(villages));
  }, [villages]);

  const onInsertRow = () => {
    setItems([...items, {}]);
  };

  const onSelectParent = (item, parent) => {
    // eslint-disable-next-line no-param-reassign
    item.parent = parent;
    setItems([...items]);
  };

  const onVillagesChange = (item, entities) => {
    // eslint-disable-next-line no-param-reassign
    item.entities = entities;
    handleChange(items);
  };

  const createRow = (parent) => {
    const {
      children: { edges },
    } = parent;
    const entities = edges?.map((edge) => edge.node) ?? [];
    const createdRow = {};
    // eslint-disable-next-line no-param-reassign
    createdRow.parent = parent;
    // eslint-disable-next-line no-param-reassign
    createdRow.entities = entities;
    return createdRow;
  };

  const clearItems = () => {
    setItems([]);
    handleChange([]);
  };

  const executeNewRows = (newRows, uniqueRows) => {
    if (!items.length) {
      setItems([...items, ...newRows]);
      handleChange([...items, ...newRows]);
    } else {
      setItems([...items, ...uniqueRows]);
      handleChange([...items, ...uniqueRows]);
    }
  };

  const filterParents = (options) => options.filter((p) => !items.some((i) => i.parent?.id === p.id));

  const filterVillages = (options) =>
    options.filter((option) => !villages?.some((village) => village?.id === option.id));

  useEffect(() => {
    if (districts?.length) {
      clearItems();
      dispatch(clearDistrictData());
      dispatch(fetchDataFromDistrict(pickedDistrictsUuids));
    } else {
      clearItems();
      dispatch(clearDistrictData());
    }
  }, [districts]);

  useEffect(() => {
    if (fetchedDistrictDataFlag) {
      const createdRows = data.map((mun) => createRow(mun));
      const uniqueRows = createdRows.filter((row) => !items.some((i) => i.parent.uuid === row.parent.uuid));
      executeNewRows(createdRows, uniqueRows);
    }
  }, [data]);

  useEffect(() => {
    if (isOfficerPanelEnabled) {
      clearItems();
      dispatch(clearDistrictData());
    }
  }, [isOfficerPanelEnabled]);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead className={classes.header}>
          <TableRow className={classes.headerTitle}>
            <TableCell>{formatMessage("table.municipality")}</TableCell>
            <TableCell>{formatMessage("table.villages")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.parent?.id}>
              <TableCell>
                {item.parent ? (
                  `${item.parent.code} ${item.parent.name}`
                ) : (
                  <PublishedComponent
                    pubRef="location.LocationPicker"
                    parentLocation={location}
                    onChange={(parent) => onSelectParent(item, parent)}
                    required
                    filterOptions={filterParents}
                    value={item.parent}
                    locationLevel={2}
                  />
                )}
              </TableCell>
              <TableCell>
                <PublishedComponent
                  fullWidth
                  pubRef="location.LocationPicker"
                  parentLocation={item.parent}
                  readOnly={readOnly}
                  required
                  multiple
                  value={item.entities}
                  onChange={(value) => onVillagesChange(item, value)}
                  filterOptions={filterVillages}
                  locationLevel={3}
                />
              </TableCell>
              <TableCell className={classes.actionCell}>
                <IconButton disabled={readOnly} onClick={() => onRemoveRow(item)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <Button
            disabled={readOnly}
            variant="contained"
            onClick={onInsertRow}
            startIcon={<AddIcon />}
            className={classes.footer}
          >
            {formatMessage("table.newRow")}
          </Button>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

const enhance = combine(withModulesManager, withTheme, withStyles(styles));

export default enhance(EnrolmentVillagesPicker);
