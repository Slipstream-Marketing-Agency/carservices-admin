import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { servicePath } from 'constants/defaultValues';

import ListPageHeading from 'containers/pages/ListPageHeading';
import AddNewModal from 'containers/pages/AddNewModal';
import ListPageListing from 'containers/pages/ListPageListing';
import useMousetrap from 'hooks/use-mousetrap';
import { useHistory } from 'react-router-dom';
import { getCurrentUser } from 'helpers/Utils';
import { NotificationManager } from 'components/common/react-notifications';

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const apiUrl = `${servicePath}/cakes/paging`;

const orderOptions = [
  { column: 'name', label: 'Workshop Name' },
];
const pageSizes = [4, 8, 12, 20];

const WorkshopListPage = ({ match }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayMode, setDisplayMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(8);
  const [selectedOrderOption, setSelectedOrderOption] = useState({
    column: 'name',
    label: 'Workshop Name',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);

  const router = useHistory();

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPageSize, selectedOrderOption]);

  useEffect(() => {
    fetchData();
  }, [selectedPageSize, currentPage, selectedOrderOption, search]);

  const fetchData = async () => {
    let user = getCurrentUser();
    axios
      .get(
        `${process.env.REACT_APP_API_KEY}admin/workshop?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${selectedOrderOption.column}&search=${search}`,
        {
          headers: {
            Authorization: "Bearer " + user.token
          }
        }
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setTotalPage(data.totalPage);
        setItems(
          data.workshop.map((x) => {
            let item = { ...x, title: x.name, img: process.env.REACT_APP_S3_URL + x.logo }
            if (x.isFeatured) {
              item.status = "Featured";
              item.statusColor = "danger"
            }
            
            return item;
            return { ...x, img: x.img.replace('img/', 'img/products/') };
          })
        );
        setSelectedItems([]);
        setTotalItemCount(data.workshopCount);
        setIsLoaded(true);
      });
  }

  const onCheckItem = (event, id) => {
    if (
      event.target.tagName === 'A' ||
      (event.target.parentElement && event.target.parentElement.tagName === 'A')
    ) {
      return true;
    }
    if (lastChecked === null) {
      setLastChecked(id);
    }

    let selectedList = [...selectedItems];
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id);
    } else {
      selectedList.push(id);
    }
    setSelectedItems(selectedList);

    if (event.shiftKey) {
      let newItems = [...items];
      const start = getIndex(id, newItems, 'id');
      const end = getIndex(lastChecked, newItems, 'id');
      newItems = newItems.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...newItems.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedItems));
      setSelectedItems(selectedList);
    }
    document.activeElement.blur();
    return false;
  };

  const handleChangeSelectAll = (isToggle) => {
    if (selectedItems.length >= items.length) {
      if (isToggle) {
        setSelectedItems([]);
      }
    } else {
      setSelectedItems(items.map((x) => x.id));
    }
    document.activeElement.blur();
    return false;
  };

  const onContextMenuClick = (e, data) => {
    console.log('onContextMenuClick - selected items', selectedItems);
    console.log('onContextMenuClick - action : ', data.action);
  };

  const onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!selectedItems.includes(clickedProductId)) {
      setSelectedItems([clickedProductId]);
    }

    return true;
  };

  const setFeatured = () => {
    let user = getCurrentUser();
    axios.post(`${process.env.REACT_APP_API_KEY}admin/workshop/featured`, {
      workshop: {
        ids: selectedItems
      }
    }, {
      headers: {
        Authorization: "Bearer " + user.token
      }
    }).then(res => {
      fetchData();
      NotificationManager.success(selectedItems.length + " workshops will start to feature in website", "Workshops Featured", 3000, null, null, '');
    }).catch(err => {
      NotificationManager.warning(err, 'Something Went Wrong!', 3000, null, null, '');
    })
  }

  const removeFeatured = () => {
    let user = getCurrentUser();
    axios.post(`${process.env.REACT_APP_API_KEY}admin/workshop/featured/remove`, {
      workshop: {
        ids: selectedItems
      }
    }, {
      headers: {
        Authorization: "Bearer " + user.token
      }
    }).then(res => {
      fetchData();
      NotificationManager.success(selectedItems.length + " workshops will not be featured in website", "Removed Featured", 3000, null, null, '');
    }).catch(err => {
      NotificationManager.warning(err, 'Something Went Wrong!', 3000, null, null, '');
    })
  }

  useMousetrap(['ctrl+a', 'command+a'], () => {
    handleChangeSelectAll(false);
  });

  useMousetrap(['ctrl+d', 'command+d'], () => {
    setSelectedItems([]);
    return false;
  });

  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  return !isLoaded ? (
    <div className="loading" />
  ) : (
    <>
      <div className="disable-text-selection">
        <ListPageHeading
          heading="Workshop List"
          displayMode={displayMode}
          changeDisplayMode={setDisplayMode}
          handleChangeSelectAll={handleChangeSelectAll}
          changeOrderBy={(column) => {
            setSelectedOrderOption(
              orderOptions.find((x) => x.column === column)
            );
          }}
          changePageSize={setSelectedPageSize}
          selectedPageSize={selectedPageSize}
          totalItemCount={totalItemCount}
          selectedOrderOption={selectedOrderOption}
          match={match}
          startIndex={startIndex}
          endIndex={endIndex}
          selectedItemsLength={selectedItems ? selectedItems.length : 0}
          itemsLength={items ? items.length : 0}
          onSearchKey={(e) => {
            if (e.key === 'Enter') {
              setSearch(e.target.value.toLowerCase());
            }
          }}
          orderOptions={orderOptions}
          pageSizes={pageSizes}
          setFeatured={setFeatured}
          removeFeatured={removeFeatured}
          toggleModal={() => router.push('/app/content/workshop/add')}
        //   toggleModal={() => setModalOpen(!modalOpen)}
        />
        <ListPageListing
          items={items}
          displayMode={displayMode}
          selectedItems={selectedItems}
          onCheckItem={onCheckItem}
          currentPage={currentPage}
          totalPage={totalPage}
          onContextMenuClick={onContextMenuClick}
          onContextMenu={onContextMenu}
          onChangePage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default WorkshopListPage;
