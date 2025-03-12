import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.awt.image.ConvolveOp;
import java.awt.image.Kernel;
import java.io.File;
import javax.imageio.ImageIO;

public class AdvancedImageProcessor extends JFrame {
    private BufferedImage originalImage;
    private BufferedImage processedImage;
    private JLabel imageLabel;
    private JPanel controlPanel;
    private JSlider brightnessSlider;
    private JSlider contrastSlider;
    private JSlider saturationSlider;
    private final int WIDTH = 1200;
    private final int HEIGHT = 800;

    public AdvancedImageProcessor() {
        setTitle("Advanced Image Processor");
        setSize(WIDTH, HEIGHT);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        initializeUI();
    }

    private void initializeUI() {
        // Main layout
        setLayout(new BorderLayout());

        // Image display area
        imageLabel = new JLabel();
        imageLabel.setHorizontalAlignment(JLabel.CENTER);
        JScrollPane scrollPane = new JScrollPane(imageLabel);
        add(scrollPane, BorderLayout.CENTER);

        // Control panel
        controlPanel = new JPanel();
        controlPanel.setLayout(new BoxLayout(controlPanel, BoxLayout.Y_AXIS));
        controlPanel.setBorder(BorderFactory.createTitledBorder("Controls"));

        // Menu Bar
        JMenuBar menuBar = createMenuBar();
        setJMenuBar(menuBar);

        // Sliders
        createSliders();

        // Filters panel
        JPanel filtersPanel = createFiltersPanel();
        controlPanel.add(filtersPanel);

        // Add control panel to frame
        add(controlPanel, BorderLayout.EAST);
    }

    private JMenuBar createMenuBar() {
        JMenuBar menuBar = new JMenuBar();
        JMenu fileMenu = new JMenu("File");
        JMenuItem openItem = new JMenuItem("Open");
        JMenuItem saveItem = new JMenuItem("Save");
        JMenuItem exitItem = new JMenuItem("Exit");

        openItem.addActionListener(e -> openImage());
        saveItem.addActionListener(e -> saveImage());
        exitItem.addActionListener(e -> System.exit(0));

        fileMenu.add(openItem);
        fileMenu.add(saveItem);
        fileMenu.addSeparator();
        fileMenu.add(exitItem);
        menuBar.add(fileMenu);

        return menuBar;
    }

    private void createSliders() {
        // Brightness slider
        JPanel brightnessPanel = new JPanel();
        brightnessPanel.setLayout(new BoxLayout(brightnessPanel, BoxLayout.Y_AXIS));
        brightnessSlider = new JSlider(JSlider.HORIZONTAL, -100, 100, 0);
        brightnessSlider.setMajorTickSpacing(50);
        brightnessSlider.setPaintTicks(true);
        brightnessSlider.setPaintLabels(true);
        brightnessPanel.add(new JLabel("Brightness"));
        brightnessPanel.add(brightnessSlider);
        controlPanel.add(brightnessPanel);

        // Contrast slider
        JPanel contrastPanel = new JPanel();
        contrastPanel.setLayout(new BoxLayout(contrastPanel, BoxLayout.Y_AXIS));
        contrastSlider = new JSlider(JSlider.HORIZONTAL, -100, 100, 0);
        contrastSlider.setMajorTickSpacing(50);
        contrastSlider.setPaintTicks(true);
        contrastSlider.setPaintLabels(true);
        contrastPanel.add(new JLabel("Contrast"));
        contrastPanel.add(contrastSlider);
        controlPanel.add(contrastPanel);

        // Saturation slider
        JPanel saturationPanel = new JPanel();
        saturationPanel.setLayout(new BoxLayout(saturationPanel, BoxLayout.Y_AXIS));
        saturationSlider = new JSlider(JSlider.HORIZONTAL, -100, 100, 0);
        saturationSlider.setMajorTickSpacing(50);
        saturationSlider.setPaintTicks(true);
        saturationSlider.setPaintLabels(true);
        saturationPanel.add(new JLabel("Saturation"));
        saturationPanel.add(saturationSlider);
        controlPanel.add(saturationPanel);

        // Add listeners
        brightnessSlider.addChangeListener(e -> applyImageProcessing());
        contrastSlider.addChangeListener(e -> applyImageProcessing());
        saturationSlider.addChangeListener(e -> applyImageProcessing());
    }

    private JPanel createFiltersPanel() {
        JPanel filtersPanel = new JPanel();
        filtersPanel.setLayout(new GridLayout(3, 2, 5, 5));
        filtersPanel.setBorder(BorderFactory.createTitledBorder("Filters"));

        String[] filters = {"Blur", "Sharpen", "Edge Detection", "Grayscale", "Sepia", "Invert"};
        for (String filter : filters) {
            JButton filterButton = new JButton(filter);
            filterButton.addActionListener(e -> applyFilter(filter));
            filtersPanel.add(filterButton);
        }

        return filtersPanel;
    }

    private void openImage() {
        JFileChooser chooser = new JFileChooser();
        FileNameExtensionFilter filter = new FileNameExtensionFilter(
            "Images", "jpg", "jpeg", "png", "gif");
        chooser.setFileFilter(filter);

        if (chooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
            try {
                originalImage = ImageIO.read(chooser.getSelectedFile());
                processedImage = new BufferedImage(
                    originalImage.getWidth(),
                    originalImage.getHeight(),
                    BufferedImage.TYPE_INT_RGB
                );
                processedImage.getGraphics().drawImage(originalImage, 0, 0, null);
                updateImageDisplay();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error opening image: " + ex.getMessage());
            }
        }
    }

    private void saveImage() {
        if (processedImage == null) {
            JOptionPane.showMessageDialog(this, "No image to save!");
            return;
        }

        JFileChooser chooser = new JFileChooser();
        FileNameExtensionFilter filter = new FileNameExtensionFilter(
            "PNG Images", "png");
        chooser.setFileFilter(filter);

        if (chooser.showSaveDialog(this) == JFileChooser.APPROVE_OPTION) {
            try {
                File file = chooser.getSelectedFile();
                if (!file.getName().toLowerCase().endsWith(".png")) {
                    file = new File(file.getAbsolutePath() + ".png");
                }
                ImageIO.write(processedImage, "png", file);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error saving image: " + ex.getMessage());
            }
        }
    }

    private void applyImageProcessing() {
        if (originalImage == null) return;

        processedImage = new BufferedImage(
            originalImage.getWidth(),
            originalImage.getHeight(),
            BufferedImage.TYPE_INT_RGB
        );

        // Apply brightness, contrast, and saturation
        float brightness = brightnessSlider.getValue() / 100f;
        // Fixed contrast calculation with explicit float casting
        float contrast = (float)(1.0 + (contrastSlider.getValue() / 100.0));
        float saturation = 1 + (saturationSlider.getValue() / 100f);

        for (int y = 0; y < originalImage.getHeight(); y++) {
            for (int x = 0; x < originalImage.getWidth(); x++) {
                Color color = new Color(originalImage.getRGB(x, y));
                
                // Convert to HSB
                float[] hsb = Color.RGBtoHSB(color.getRed(), color.getGreen(), color.getBlue(), null);
                
                // Apply adjustments
                hsb[1] *= saturation; // Saturation
                hsb[1] = Math.max(0, Math.min(1, hsb[1]));
                
                // Apply contrast and brightness
                hsb[2] = Math.max(0, Math.min(1, (hsb[2] - 0.5f) * contrast + 0.5f + brightness));
                
                // Convert back to RGB
                Color adjustedColor = new Color(Color.HSBtoRGB(hsb[0], hsb[1], hsb[2]));
                processedImage.setRGB(x, y, adjustedColor.getRGB());
            }
        }

        updateImageDisplay();
    }

    private void applyFilter(String filterName) {
        if (originalImage == null) return;

        switch (filterName) {
            case "Blur":
                float[] blurKernel = {
                    1/9f, 1/9f, 1/9f,
                    1/9f, 1/9f, 1/9f,
                    1/9f, 1/9f, 1/9f
                };
                applyConvolution(blurKernel);
                break;

            case "Sharpen":
                float[] sharpenKernel = {
                    0, -1, 0,
                    -1, 5, -1,
                    0, -1, 0
                };
                applyConvolution(sharpenKernel);
                break;

            case "Edge Detection":
                float[] edgeKernel = {
                    -1, -1, -1,
                    -1,  8, -1,
                    -1, -1, -1
                };
                applyConvolution(edgeKernel);
                break;

            case "Grayscale":
                for (int y = 0; y < processedImage.getHeight(); y++) {
                    for (int x = 0; x < processedImage.getWidth(); x++) {
                        Color color = new Color(processedImage.getRGB(x, y));
                        int gray = (int) (0.299 * color.getRed() + 0.587 * color.getGreen() + 0.114 * color.getBlue());
                        Color grayColor = new Color(gray, gray, gray);
                        processedImage.setRGB(x, y, grayColor.getRGB());
                    }
                }
                break;

            case "Sepia":
                for (int y = 0; y < processedImage.getHeight(); y++) {
                    for (int x = 0; x < processedImage.getWidth(); x++) {
                        Color color = new Color(processedImage.getRGB(x, y));
                        int r = color.getRed();
                        int g = color.getGreen();
                        int b = color.getBlue();

                        int tr = Math.min(255, (int)(0.393*r + 0.769*g + 0.189*b));
                        int tg = Math.min(255, (int)(0.349*r + 0.686*g + 0.168*b));
                        int tb = Math.min(255, (int)(0.272*r + 0.534*g + 0.131*b));

                        processedImage.setRGB(x, y, new Color(tr, tg, tb).getRGB());
                    }
                }
                break;

            case "Invert":
                for (int y = 0; y < processedImage.getHeight(); y++) {
                    for (int x = 0; x < processedImage.getWidth(); x++) {
                        Color color = new Color(processedImage.getRGB(x, y));
                        Color inverted = new Color(255 - color.getRed(),
                                                 255 - color.getGreen(),
                                                 255 - color.getBlue());
                        processedImage.setRGB(x, y, inverted.getRGB());
                    }
                }
                break;
        }

        updateImageDisplay();
    }

    private void applyConvolution(float[] kernel) {
        Kernel k = new Kernel(3, 3, kernel);
        ConvolveOp op = new ConvolveOp(k, ConvolveOp.EDGE_NO_OP, null);
        BufferedImage output = new BufferedImage(processedImage.getWidth(),
                                               processedImage.getHeight(),
                                               processedImage.getType());
        op.filter(processedImage, output);
        processedImage = output;
    }

    private void updateImageDisplay() {
        if (processedImage != null) {
            // Scale image if needed
            int maxWidth = WIDTH - controlPanel.getWidth() - 40;
            int maxHeight = HEIGHT - 100;
            
            double scale = Math.min(
                (double) maxWidth / processedImage.getWidth(),
                (double) maxHeight / processedImage.getHeight()
            );
            
            if (scale < 1) {
                int scaledWidth = (int) (processedImage.getWidth() * scale);
                int scaledHeight = (int) (processedImage.getHeight() * scale);
                
                Image scaledImage = processedImage.getScaledInstance(
                    scaledWidth, scaledHeight, Image.SCALE_SMOOTH);
                imageLabel.setIcon(new ImageIcon(scaledImage));
            } else {
                imageLabel.setIcon(new ImageIcon(processedImage));
            }
            
            revalidate();
            repaint();
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception e) {
                e.printStackTrace();
            }
            new AdvancedImageProcessor().setVisible(true);
        });
    }
}
