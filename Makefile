CC := g++
SRCDIR := src
BUILDDIR := build
TARGET := bin/void
TARGET_LIB := bin/libdiff.so
 
SRCEXT := cpp
SOURCES := $(shell find $(SRCDIR) -type f -name *.$(SRCEXT))
OBJECTS := $(patsubst $(SRCDIR)/%,$(BUILDDIR)/%,$(SOURCES:.$(SRCEXT)=.o))
CFLAGS := -std=c++11

$(TARGET): $(OBJECTS)
	@echo " Linking..."
	$(CC) $^ -o $(TARGET) $(LIB)

$(BUILDDIR)/%.o: $(SRCDIR)/%.$(SRCEXT)
	@mkdir -p $(BUILDDIR)/$(LIBDIR)
	$(CC) $(CFLAGS) $(INC) -c -o $@ $<

clean:
	@echo " Cleaning..."; 
	$(RM) -r $(BUILDDIR)/*.o $(TARGET) $(TARGET_LIB)

libdiff:
	@echo " Building libdiff"
	g++ $(CFLAGS) -shared -fPIC src/diff_c.c src/diff.cpp -o $(TARGET_LIB)

.PHONY: clean