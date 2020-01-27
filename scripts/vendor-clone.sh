#! /bin/bash

# Clone react-store if necessary
if [ -d "src/vendor/react-store" ]; then
    echo "Skipping react-store (already cloned)"
else
    echo "Cloning react-store to src/vendor/react-store"
    git clone git@github.com:toggle-corp/react-store.git src/vendor/react-store
    git checkout feature/bipad-v2
fi

# Clone re-map if necessary
if [ -d "src/vendor/re-map" ]; then
    echo "Skipping re-map (already cloned)"
else
    echo "Cloning re-map to src/vendor/re-map"
    git clone git@github.com:toggle-corp/react-store.git src/vendor/re-map
    git checkout feature/use-dimension
fi

# Clone osm-liberty if necessary
if [ -d "src/vendor/osm-liberty" ]; then
    echo "Skipping osm-liberty (already cloned)"
else
    echo "Cloning osm-liberty to src/vendor/osm-liberty"
    git clone git@gitlab.com:bipad/osm-liberty.git src/vendor/osm-liberty
fi
