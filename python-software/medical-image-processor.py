import sys
import os
import cv2
import numpy as np
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, 
                            QLabel, QPushButton, QFileDialog, QSlider, QComboBox, 
                            QTabWidget, QGroupBox, QAction, QMenu, QToolBar, QSplitter,
                            QGridLayout, QSpacerItem, QSizePolicy, QCheckBox, QMessageBox)
from PyQt5.QtGui import QPixmap, QImage, QIcon, QFont, QPalette, QColor
from PyQt5.QtCore import Qt, QSize
from skimage import filters, exposure, morphology, segmentation, measure
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt

class ImageViewerWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.image_label = QLabel("No Image Loaded")
        self.image_label.setAlignment(Qt.AlignCenter)
        self.image_label.setStyleSheet("background-color: #2D2D30; color: #CCCCCC;")
        
        self.setLayout(QVBoxLayout())
        self.layout().addWidget(self.image_label)
        
    def display_image(self, img):
        self.current_image = img
        h, w = img.shape[:2]
        
        # Convert image to RGB format for display
        if len(img.shape) == 2:  # Grayscale
            qimg = QImage(img.data, w, h, w, QImage.Format_Grayscale8)
        else:  # Color
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            qimg = QImage(rgb_img.data, w, h, w * 3, QImage.Format_RGB888)
            
        pixmap = QPixmap.fromImage(qimg)
        
        # Scale pixmap to fit the label while maintaining aspect ratio
        self.image_label.setPixmap(pixmap.scaled(self.image_label.size(), 
                                              Qt.KeepAspectRatio, 
                                              Qt.SmoothTransformation))
        self.image_label.setText("")

    def resizeEvent(self, event):
        if hasattr(self, 'current_image') and self.current_image is not None:
            self.display_image(self.current_image)
        super().resizeEvent(event)


class HistogramWidget(FigureCanvas):
    def __init__(self, parent=None):
        self.fig = Figure(figsize=(5, 4), dpi=100)
        self.axes = self.fig.add_subplot(111)
        super().__init__(self.fig)
        self.setParent(parent)
        self.fig.set_facecolor('#2D2D30')
        self.axes.set_facecolor('#2D2D30')
        self.axes.tick_params(colors='#CCCCCC')
        self.axes.spines['bottom'].set_color('#CCCCCC')
        self.axes.spines['top'].set_color('#CCCCCC') 
        self.axes.spines['right'].set_color('#CCCCCC')
        self.axes.spines['left'].set_color('#CCCCCC')
        self.axes.set_title('Histogram', color='#CCCCCC')
        self.axes.set_xlabel('Pixel Value', color='#CCCCCC')
        self.axes.set_ylabel('Frequency', color='#CCCCCC')
        
    def update_histogram(self, image):
        self.axes.clear()
        self.axes.set_facecolor('#2D2D30')
        self.axes.tick_params(colors='#CCCCCC')
        
        if len(image.shape) == 2:  # Grayscale
            self.axes.hist(image.ravel(), bins=256, range=[0, 256], color='white', alpha=0.7)
            self.axes.set_title('Grayscale Histogram', color='#CCCCCC')
        else:  # Color
            colors = ('b', 'g', 'r')
            for i, color in enumerate(colors):
                self.axes.hist(image[:,:,i].ravel(), bins=256, range=[0, 256], 
                              color=color, alpha=0.5, label=f'{color.upper()} Channel')
            self.axes.legend(loc='upper right')
            self.axes.set_title('RGB Histogram', color='#CCCCCC')
            
        self.axes.set_xlabel('Pixel Value', color='#CCCCCC')
        self.axes.set_ylabel('Frequency', color='#CCCCCC')
        self.fig.tight_layout()
        self.draw()


class MedicalImageProcessorApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.original_image = None
        self.processed_image = None
        self.init_ui()
        
    def init_ui(self):
        # Set window properties
        self.setWindowTitle('Medical Image Processor')
        self.setGeometry(100, 100, 1200, 800)
        self.setStyleSheet("""
            QMainWindow, QWidget {
                background-color: #1E1E1E;
                color: #FFFFFF;
            }
            QTabWidget::pane {
                border: 1px solid #3E3E40;
                background-color: #2D2D30;
            }
            QTabBar::tab {
                background-color: #333337;
                color: #CCCCCC;
                padding: 8px 16px;
                border: 1px solid #3E3E40;
                border-bottom: none;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            }
            QTabBar::tab:selected {
                background-color: #007ACC;
                color: white;
            }
            QPushButton {
                background-color: #0078D7;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #1C97EA;
            }
            QPushButton:pressed {
                background-color: #00669C;
            }
            QComboBox, QSlider {
                background-color: #333337;
                color: #CCCCCC;
                border: 1px solid #3E3E40;
                border-radius: 3px;
                padding: 3px;
            }
            QGroupBox {
                border: 1px solid #3E3E40;
                border-radius: 5px;
                margin-top: 10px;
                padding-top: 15px;
                font-weight: bold;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                subcontrol-position: top center;
                padding: 0 5px;
                color: #CCCCCC;
            }
            QLabel {
                color: #CCCCCC;
            }
            QSlider::groove:horizontal {
                height: 4px;
                background: #444444;
                margin: 0px;
                border-radius: 2px;
            }
            QSlider::handle:horizontal {
                background: #0078D7;
                width: 12px;
                height: 12px;
                margin: -4px 0;
                border-radius: 6px;
            }
            QComboBox QAbstractItemView {
                background-color: #333337;
                color: #CCCCCC;
                selection-background-color: #007ACC;
            }
        """)
        
        # Create main layout
        main_widget = QWidget()
        main_layout = QVBoxLayout(main_widget)
        
        # Create splitter for resizable panels
        splitter = QSplitter(Qt.Horizontal)
        
        # Create left panel for images
        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        
        # Image viewers
        image_layout = QHBoxLayout()
        
        self.original_view = ImageViewerWidget()
        self.processed_view = ImageViewerWidget()
        
        image_layout.addWidget(self.create_group_box("Original Image", self.original_view))
        image_layout.addWidget(self.create_group_box("Processed Image", self.processed_view))
        
        left_layout.addLayout(image_layout)
        
        # Create histogram widget
        self.histogram_widget = HistogramWidget()
        left_layout.addWidget(self.create_group_box("Image Histogram", self.histogram_widget))
        
        # Create right panel for controls
        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        
        # File operations group
        file_group = QGroupBox("File Operations")
        file_layout = QVBoxLayout(file_group)
        
        self.load_btn = QPushButton("Load Image")
        self.save_btn = QPushButton("Save Processed Image")
        self.save_btn.setEnabled(False)
        
        file_layout.addWidget(self.load_btn)
        file_layout.addWidget(self.save_btn)
        
        right_layout.addWidget(file_group)
        
        # Operations tab widget
        operations_tabs = QTabWidget()
        
        # Basic processing tab
        basic_tab = QWidget()
        basic_layout = QVBoxLayout(basic_tab)
        
        # Brightness/Contrast controls
        bright_contrast_group = QGroupBox("Brightness & Contrast")
        bright_contrast_layout = QGridLayout(bright_contrast_group)
        
        bright_contrast_layout.addWidget(QLabel("Brightness:"), 0, 0)
        self.brightness_slider = QSlider(Qt.Horizontal)
        self.brightness_slider.setRange(-100, 100)
        self.brightness_slider.setValue(0)
        bright_contrast_layout.addWidget(self.brightness_slider, 0, 1)
        
        bright_contrast_layout.addWidget(QLabel("Contrast:"), 1, 0)
        self.contrast_slider = QSlider(Qt.Horizontal)
        self.contrast_slider.setRange(-100, 100)
        self.contrast_slider.setValue(0)
        bright_contrast_layout.addWidget(self.contrast_slider, 1, 1)
        
        bright_contrast_layout.addWidget(QLabel("Gamma:"), 2, 0)
        self.gamma_slider = QSlider(Qt.Horizontal)
        self.gamma_slider.setRange(1, 500)
        self.gamma_slider.setValue(100)
        bright_contrast_layout.addWidget(self.gamma_slider, 2, 1)
        
        basic_layout.addWidget(bright_contrast_group)
        
        # Filters group
        filters_group = QGroupBox("Filters")
        filters_layout = QGridLayout(filters_group)
        
        filters_layout.addWidget(QLabel("Filter Type:"), 0, 0)
        self.filter_combo = QComboBox()
        self.filter_combo.addItems(["None", "Gaussian Blur", "Median Blur", "Bilateral Filter", 
                                   "Sharpening", "Edge Detection"])
        filters_layout.addWidget(self.filter_combo, 0, 1)
        
        filters_layout.addWidget(QLabel("Kernel Size:"), 1, 0)
        self.kernel_slider = QSlider(Qt.Horizontal)
        self.kernel_slider.setRange(1, 15)
        self.kernel_slider.setValue(3)
        self.kernel_slider.setSingleStep(2)  # Only odd values
        filters_layout.addWidget(self.kernel_slider, 1, 1)
        
        basic_layout.addWidget(filters_group)
        basic_layout.addStretch()
        
        # Advanced processing tab
        advanced_tab = QWidget()
        advanced_layout = QVBoxLayout(advanced_tab)
        
        # Segmentation group
        segmentation_group = QGroupBox("Segmentation")
        segmentation_layout = QGridLayout(segmentation_group)
        
        segmentation_layout.addWidget(QLabel("Method:"), 0, 0)
        self.segmentation_combo = QComboBox()
        self.segmentation_combo.addItems(["None", "Threshold", "Adaptive Threshold", 
                                         "Otsu's Method", "Watershed"])
        segmentation_layout.addWidget(self.segmentation_combo, 0, 1)
        
        segmentation_layout.addWidget(QLabel("Threshold:"), 1, 0)
        self.threshold_slider = QSlider(Qt.Horizontal)
        self.threshold_slider.setRange(0, 255)
        self.threshold_slider.setValue(127)
        segmentation_layout.addWidget(self.threshold_slider, 1, 1)
        
        advanced_layout.addWidget(segmentation_group)
        
        # Morphology group
        morphology_group = QGroupBox("Morphological Operations")
        morphology_layout = QGridLayout(morphology_group)
        
        morphology_layout.addWidget(QLabel("Operation:"), 0, 0)
        self.morphology_combo = QComboBox()
        self.morphology_combo.addItems(["None", "Erosion", "Dilation", "Opening", "Closing"])
        morphology_layout.addWidget(self.morphology_combo, 0, 1)
        
        morphology_layout.addWidget(QLabel("Kernel Size:"), 1, 0)
        self.morph_kernel_slider = QSlider(Qt.Horizontal)
        self.morph_kernel_slider.setRange(1, 15)
        self.morph_kernel_slider.setValue(3)
        self.morph_kernel_slider.setSingleStep(2)
        morphology_layout.addWidget(self.morph_kernel_slider, 1, 1)
        
        advanced_layout.addWidget(morphology_group)
        
        # Enhancement group
        enhancement_group = QGroupBox("Enhancement")
        enhancement_layout = QGridLayout(enhancement_group)
        
        enhancement_layout.addWidget(QLabel("Method:"), 0, 0)
        self.enhancement_combo = QComboBox()
        self.enhancement_combo.addItems(["None", "Histogram Equalization", "CLAHE", 
                                        "Contrast Stretching", "Sharpening"])
        enhancement_layout.addWidget(self.enhancement_combo, 0, 1)
        
        advanced_layout.addWidget(enhancement_group)
        advanced_layout.addStretch()
        
        # Medical Analysis tab
        medical_tab = QWidget()
        medical_layout = QVBoxLayout(medical_tab)
        
        # ROI Selection
        roi_group = QGroupBox("Region of Interest (ROI)")
        roi_layout = QVBoxLayout(roi_group)
        
        self.roi_btn = QPushButton("Select ROI")
        roi_layout.addWidget(self.roi_btn)
        
        medical_layout.addWidget(roi_group)
        
        # Feature Extraction
        feature_group = QGroupBox("Feature Extraction")
        feature_layout = QGridLayout(feature_group)
        
        self.extract_features_btn = QPushButton("Extract Features")
        feature_layout.addWidget(self.extract_features_btn, 0, 0, 1, 2)
        
        self.calc_area_check = QCheckBox("Calculate Area")
        self.calc_perimeter_check = QCheckBox("Calculate Perimeter")
        self.calc_intensity_check = QCheckBox("Calculate Mean Intensity")
        self.calc_texture_check = QCheckBox("Calculate Texture Features")
        
        feature_layout.addWidget(self.calc_area_check, 1, 0)
        feature_layout.addWidget(self.calc_perimeter_check, 1, 1)
        feature_layout.addWidget(self.calc_intensity_check, 2, 0)
        feature_layout.addWidget(self.calc_texture_check, 2, 1)
        
        feature_group.setLayout(feature_layout)
        medical_layout.addWidget(feature_group)
        
        medical_layout.addStretch()
        
        # Add tabs to the operations tab widget
        operations_tabs.addTab(basic_tab, "Basic Processing")
        operations_tabs.addTab(advanced_tab, "Advanced Processing")
        operations_tabs.addTab(medical_tab, "Medical Analysis")
        
        right_layout.addWidget(operations_tabs)
        
        # Process button
        self.process_btn = QPushButton("Apply Processing")
        self.process_btn.setEnabled(False)
        right_layout.addWidget(self.process_btn)
        
        # Reset button
        self.reset_btn = QPushButton("Reset to Original")
        self.reset_btn.setEnabled(False)
        right_layout.addWidget(self.reset_btn)
        
        # Add panels to splitter
        splitter.addWidget(left_panel)
        splitter.addWidget(right_panel)
        
        # Set initial sizes
        splitter.setSizes([700, 500])
        
        main_layout.addWidget(splitter)
        self.setCentralWidget(main_widget)
        
        # Connect signals
        self.load_btn.clicked.connect(self.load_image)
        self.save_btn.clicked.connect(self.save_image)
        self.process_btn.clicked.connect(self.apply_processing)
        self.reset_btn.clicked.connect(self.reset_image)
        
        self.brightness_slider.valueChanged.connect(self.processing_changed)
        self.contrast_slider.valueChanged.connect(self.processing_changed)
        self.gamma_slider.valueChanged.connect(self.processing_changed)
        self.filter_combo.currentIndexChanged.connect(self.processing_changed)
        self.kernel_slider.valueChanged.connect(self.processing_changed)
        self.segmentation_combo.currentIndexChanged.connect(self.processing_changed)
        self.threshold_slider.valueChanged.connect(self.processing_changed)
        self.morphology_combo.currentIndexChanged.connect(self.processing_changed)
        self.morph_kernel_slider.valueChanged.connect(self.processing_changed)
        self.enhancement_combo.currentIndexChanged.connect(self.processing_changed)
        
        self.roi_btn.clicked.connect(self.select_roi)
        self.extract_features_btn.clicked.connect(self.extract_features)
        
        # Show the UI
        self.show()
    
    def create_group_box(self, title, widget):
        group = QGroupBox(title)
        layout = QVBoxLayout(group)
        layout.addWidget(widget)
        return group
    
    def load_image(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Open Image", "", "Image Files (*.png *.jpg *.jpeg *.bmp *.tif *.tiff *.dcm)"
        )
        
        if file_path:
            # Handle DICOM files specially
            if file_path.lower().endswith('.dcm'):
                try:
                    import pydicom
                    dicom_data = pydicom.dcmread(file_path)
                    self.original_image = dicom_data.pixel_array
                    
                    # Normalize to 8-bit for display
                    if self.original_image.max() > 255:
                        self.original_image = self.original_image / self.original_image.max() * 255
                    
                    self.original_image = self.original_image.astype(np.uint8)
                except ImportError:
                    QMessageBox.warning(
                        self, "Missing Library", 
                        "PyDICOM library is required to open DICOM files. Please install it."
                    )
                    return
                except Exception as e:
                    QMessageBox.warning(self, "Error", f"Failed to open DICOM file: {str(e)}")
                    return
            else:
                # Read regular image formats
                self.original_image = cv2.imread(file_path)
                
                if self.original_image is None:
                    QMessageBox.warning(self, "Error", "Failed to load image.")
                    return
            
            self.processed_image = self.original_image.copy()
            
            # Update UI
            self.original_view.display_image(self.original_image)
            self.processed_view.display_image(self.processed_image)
            self.histogram_widget.update_histogram(self.original_image)
            
            # Enable processing controls
            self.process_btn.setEnabled(True)
            self.reset_btn.setEnabled(True)
            self.save_btn.setEnabled(True)
            
            # Reset sliders and combos
            self.reset_controls()
    
    def save_image(self):
        if self.processed_image is None:
            return
            
        file_path, _ = QFileDialog.getSaveFileName(
            self, "Save Image", "", "PNG (*.png);;JPEG (*.jpg);;TIFF (*.tiff)"
        )
        
        if file_path:
            try:
                cv2.imwrite(file_path, self.processed_image)
                QMessageBox.information(self, "Success", "Image saved successfully.")
            except Exception as e:
                QMessageBox.warning(self, "Error", f"Failed to save image: {str(e)}")
    
    def reset_controls(self):
        # Reset all sliders and combos to default values
        self.brightness_slider.setValue(0)
        self.contrast_slider.setValue(0)
        self.gamma_slider.setValue(100)
        self.filter_combo.setCurrentIndex(0)
        self.kernel_slider.setValue(3)
        self.segmentation_combo.setCurrentIndex(0)
        self.threshold_slider.setValue(127)
        self.morphology_combo.setCurrentIndex(0)
        self.morph_kernel_slider.setValue(3)
        self.enhancement_combo.setCurrentIndex(0)
    
    def processing_changed(self):
        # Called when any processing control changes
        pass  # We'll apply processing only when the "Apply" button is clicked
    
    def apply_processing(self):
        if self.original_image is None:
            return
            
        # Start with the original image
        self.processed_image = self.original_image.copy()
        
        # Apply basic processing
        self.apply_brightness_contrast()
        self.apply_filters()
        
        # Apply advanced processing
        self.apply_segmentation()
        self.apply_morphology()
        self.apply_enhancement()
        
        # Update UI
        self.processed_view.display_image(self.processed_image)
        self.histogram_widget.update_histogram(self.processed_image)
    
    def apply_brightness_contrast(self):
        brightness = self.brightness_slider.value()
        contrast = self.contrast_slider.value() / 100 + 1.0  # Scale to range [0.0, 2.0]
        gamma = self.gamma_slider.value() / 100  # Scale to range [0.01, 5.0]
        
        # Apply brightness
        if brightness != 0:
            if brightness > 0:
                self.processed_image = cv2.add(self.processed_image, np.array([brightness]))
            else:
                self.processed_image = cv2.subtract(self.processed_image, np.array([-brightness]))
        
        # Apply contrast
        if contrast != 1.0:
            self.processed_image = cv2.convertScaleAbs(self.processed_image, alpha=contrast, beta=0)
        
        # Apply gamma correction
        if gamma != 1.0:
            inv_gamma = 1.0 / gamma
            table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in range(256)]).astype(np.uint8)
            self.processed_image = cv2.LUT(self.processed_image, table)
    
    def apply_filters(self):
        filter_type = self.filter_combo.currentText()
        kernel_size = self.kernel_slider.value()
        
        # Make sure kernel size is odd
        if kernel_size % 2 == 0:
            kernel_size += 1
        
        if filter_type == "Gaussian Blur":
            self.processed_image = cv2.GaussianBlur(
                self.processed_image, (kernel_size, kernel_size), 0
            )
        elif filter_type == "Median Blur":
            self.processed_image = cv2.medianBlur(self.processed_image, kernel_size)
        elif filter_type == "Bilateral Filter":
            self.processed_image = cv2.bilateralFilter(
                self.processed_image, kernel_size, 75, 75
            )
        elif filter_type == "Sharpening":
            kernel = np.array([
                [-1, -1, -1],
                [-1,  9, -1],
                [-1, -1, -1]
            ])
            self.processed_image = cv2.filter2D(self.processed_image, -1, kernel)
        elif filter_type == "Edge Detection":
            # Convert to grayscale if needed
            if len(self.processed_image.shape) > 2:
                gray = cv2.cvtColor(self.processed_image, cv2.COLOR_BGR2GRAY)
            else:
                gray = self.processed_image.copy()
                
            # Apply Canny edge detection
            edges = cv2.Canny(gray, 50, 150)
            
            # Convert back to BGR if the original image was color
            if len(self.processed_image.shape) > 2:
                self.processed_image = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
            else:
                self.processed_image = edges
    
    def apply_segmentation(self):
        method = self.segmentation_combo.currentText()
        threshold_value = self.threshold_slider.value()
        
        if method == "None":
            return
            
        # Convert to grayscale if needed
        if len(self.processed_image.shape) > 2:
            gray = cv2.cvtColor(self.processed_image, cv2.COLOR_BGR2GRAY)
        else:
            gray = self.processed_image.copy()
        
        if method == "Threshold":
            _, binary = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY)
            
            # Convert back to BGR if the original image was color
            if len(self.processed_image.shape) > 2:
                self.processed_image = cv2.cvtColor(binary, cv2.COLOR_GRAY2BGR)
            else:
                self.processed_image = binary
                
        elif method == "Adaptive Threshold":
            binary = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
            
            # Convert back to BGR if the original image was color
            if len(self.processed_image.shape) > 2:
                self.processed_image = cv2.cvtColor(binary, cv2.COLOR_GRAY2BGR)
            else:
                self.processed_image = binary
                
        elif method == "Otsu's Method":
            _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Convert back to BGR if the original image was color
            if len(self.processed_image.shape) > 2:
                self.processed_image = cv2.cvtColor(binary, cv2.COLOR_GRAY2BGR)
            else:
                self.processed_image = binary
                
        elif method == "Watershed":
            # This is a simplified watershed implementation
            _, binary = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY_INV)
            
            # Noise removal
            kernel = np.ones((3, 3), np.uint8)
            opening = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel, iterations=2)
            
            # Sure background area
            sure_bg = cv2.dilate(opening, kernel, iterations=3)
            
            # Finding sure foreground area
            dist_transform = cv2.distanceTransform(opening, cv2.DIST_L2, 5)
            _, sure_fg = cv2.threshold(dist_transform, 0.7 * dist_transform.max(), 255, 0)
            
            # Finding unknown region
            sure_fg = np.uint8(sure_fg)
            unknown = cv2.subtract(sure_bg, sure_fg)
            
            # Marker labelling
            _, markers = cv2.connectedComponents(sure_fg)
            markers = markers + 1
            markers[unknown == 255] = 0
            
            # Apply watershed
            if len(self.processed_image.shape) > 2:
                markers = cv2.watershed(self.processed_image, markers)
                self.processed_image[markers == -1] = [0, 0, 255]  # Mark boundaries in red
            else:
                # Create color version for watershed
                color_img = cv2.cvtColor(self.processed_image, cv2.COLOR_GRAY2BGR)
                markers = cv2.watershed(color_img, markers)
                color_img[markers == -1] = [0, 0, 255]  # Mark boundaries in red
                self.processed_image = color_img
    
    def apply_morphology(self):
        operation = self.morphology_combo.currentText()
        kernel_size = self.morph_kernel_slider.value()
        
        if operation == "None":
            return
            
        # Make sure kernel size is odd
        if kernel_size % 2 == 0:
            kernel_size += 1
            
        kernel = np.ones((kernel_size, kernel_size), np.uint8)
        
        # Apply morphological operation
        if operation == "Erosion":
            self.processed_image = cv2.erode(self.processed_image, kernel, iterations=1)
        elif operation == "Dilation":
            self.processed_image = cv2.dilate(self.processed_image, kernel, iterations=1)
        elif operation == "Opening":
            self.processed_image = cv2.morphologyEx(self.processed_image, cv2.MORPH_OPEN, kernel)
        elif operation == "Closing":
            self.processed_image = cv2.morphologyEx(self.processed_image, cv2.MORPH_CLOSE, kernel)
    
    def apply_enhancement(self):
        method = self.enhancement_combo.currentText()
        
        if method == "None":
            return
            
        if method == "Histogram Equalization":
            # Apply to grayscale image or to each channel of color image
            if len(self.processed_image.shape) > 2:
                # Convert to YUV color space
                img_yuv = cv2.cvtColor(self.processed_image, cv2.COLOR_BGR2YUV)
                # Equalize the Y channel
                img_yuv[:,:,0] = cv2.equalizeHist(img_yuv[:,:,0])
                # Convert back to BGR color space
                self.processed_image = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
            else:
                self.processed_image = cv2.equalizeHist(self.processed_image)
                
        elif method == "CLAHE":
            # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            
            if len(self.processed_image.shape) > 2:
                # Convert to LAB color space
                lab = cv2.cvtColor(self.processed_image, cv2.COLOR_BGR2LAB)
                # Apply CLAHE to L channel
                lab[:,:,0] = clahe.apply(lab[:,:,0])
                # Convert back to BGR color space
                self.processed_image = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
            else:
                self.processed_image = clahe.apply(self.processed_image)
                
        elif method == "Contrast Stretching":
            # Simple contrast stretching
            if len(self.processed_image.shape) > 2:
                for i in range(3):
                    channel = self.processed_image[:,:,i]
                    min_val = np.min(channel)
                    max_val = np.max(channel)
                    self.processed_image[:,:,i] = 255 * (channel - min_val) / (max_val - min_val)
            else:
                min_val = np.min(self.processed_image)
                max_val = np.max(self.processed_image)
                self.processed_image = 255 * (self.processed_image - min_val) / (max_val - min_val)
                
            self.processed_image = np.uint8(self.processed_image)
            
        elif method == "Sharpening":
            # Sharpening using unsharp mask
            gaussian = cv2.GaussianBlur(self.processed_image, (5, 5), 0)
            self.processed_image = cv2.addWeighted(self.processed_image, 1.5, gaussian, -0.5, 0)
    
    def reset_image(self):
        if self.original_image is None:
            return
            
        self.processed_image = self.original_image.copy()
        self.processed_view.display_image(self.processed_image)
        self.histogram_widget.update_histogram(self.processed_image)
        self.reset_controls()
    
    def select_roi(self):
        if self.processed_image is None:
            QMessageBox.warning(self, "Warning", "Please load an image first.")
            return
            
        # Make a copy for ROI selection
        img_copy = self.processed_image.copy()
        
        # Select ROI using OpenCV's selectROI function
        r = cv2.selectROI("Select ROI (press Enter to confirm, ESC to cancel)", img_copy, False)
        cv2.destroyWindow("Select ROI (press Enter to confirm, ESC to cancel)")
        
        # Extract ROI if selection is valid
        if r[2] > 0 and r[3] > 0:
            self.roi = self.processed_image[int(r[1]):int(r[1]+r[3]), int(r[0]):int(r[0]+r[2])]
            
            # Show the ROI
            cv2.imshow("Selected ROI", self.roi)
            cv2.waitKey(1)
    
    def extract_features(self):
        if not hasattr(self, 'roi') or self.roi is None:
            QMessageBox.warning(self, "Warning", "Please select a ROI first.")
            return
        
        # Convert to grayscale if not already
        if len(self.roi.shape) > 2:
            gray_roi = cv2.cvtColor(self.roi, cv2.COLOR_BGR2GRAY)
        else:
            gray_roi = self.roi.copy()
        
        # Apply thresholding to segment the region
        _, binary = cv2.threshold(gray_roi, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        features = {}
        
        # Calculate area if selected
        if self.calc_area_check.isChecked():
            area = np.sum(binary > 0)
            features["Area (pixels)"] = area
        
        # Calculate perimeter if selected
        if self.calc_perimeter_check.isChecked():
            contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if contours:
                perimeter = cv2.arcLength(contours[0], True)
                features["Perimeter (pixels)"] = perimeter
            else:
                features["Perimeter (pixels)"] = 0
        
        # Calculate mean intensity if selected
        if self.calc_intensity_check.isChecked():
            mask = binary > 0
            if np.any(mask):
                mean_intensity = np.mean(gray_roi[mask])
                features["Mean Intensity"] = mean_intensity
            else:
                features["Mean Intensity"] = 0
        
        # Calculate texture features if selected
        if self.calc_texture_check.isChecked():
            try:
                from skimage.feature import graycomatrix, graycoprops
                
                # Calculate GLCM (Gray-Level Co-Occurrence Matrix)
                glcm = graycomatrix(gray_roi, [1], [0, np.pi/4, np.pi/2, 3*np.pi/4], 256, symmetric=True, normed=True)
                
                # Calculate properties from GLCM
                contrast = graycoprops(glcm, 'contrast').mean()
                dissimilarity = graycoprops(glcm, 'dissimilarity').mean()
                homogeneity = graycoprops(glcm, 'homogeneity').mean()
                energy = graycoprops(glcm, 'energy').mean()
                correlation = graycoprops(glcm, 'correlation').mean()
                
                features["Contrast"] = contrast
                features["Dissimilarity"] = dissimilarity
                features["Homogeneity"] = homogeneity
                features["Energy"] = energy
                features["Correlation"] = correlation
                
            except ImportError:
                QMessageBox.warning(
                    self, "Missing Library", 
                    "scikit-image library is required for texture analysis. Please install it."
                )
        
        # Display the extracted features
        feature_text = "Extracted Features:\n\n"
        for feature, value in features.items():
            feature_text += f"{feature}: {value:.2f}\n"
        
        QMessageBox.information(self, "Feature Extraction Results", feature_text)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MedicalImageProcessorApp()
    sys.exit(app.exec_())
