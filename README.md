# cs174a Assignment 3
Alex Crosthwaite

## Project Requirements (Implemented)

1. Implement the assignment clearly, understandably, and with extensive comments. See README.md

2. Implement the functionality to load two square images into texture maps.

3. Apply the texture onto each face on a cube. The texture coordinates should range from (0,1) in both the s and t dimensions.

4. Create a second cube where the second image texture is mapped to each face and is zoomed out by 50%. Maintain the aspect ratio of the cube

  This was implemented by sending a scalar variable to the fragment shader. To zoom out the picture, I sent in a multiplier of 2. 
  To keep the picture on the center of the cube faces, I also sent in an offset vector that moved the texture coordinates to accomodate
  for this requirement. When the other cube was being drawn, a multiplier of 1 and a offset of 0 were sent to the fragment shader.
  
5. Implement Mip Mapping for the zoomed texure using tri-linear filtering. Filtering for the non-zoomed texture should use nearest neighbor.

  This was implemented by using the parameters gl.LINEAR_MIP_LINEAR and g.NEAREST respectively to set texture parameters.
  
6. Position both cubes within the view of your starting camera view.

7. Define two keys 'i' and 'o' that move the camera nearer or farer away from the cubes to see the effect of texture filtering.

## Project Requirements (Not-Implemented)

  All project requirements were implemented.
  
## Extra Credit Requirements (Implemented)

  1. Use the 'r' key to start and stop the rotation of both cubes. Cube from step 3 should rotate around the y-axis at 10 rpm and cube from step 4
  should rotate and half this rate around the x-axis.
  
    These keys were defined in the javascript file to set a bool value that detects whether or not the cubes are rotating. When true,
    an extra matrix multiplication was added to the Model Matrix to account for the rotation about the cubes respective axes. 
  
  2. Use the 't' key to start and stop the rotation of the texture maps themselves on all the faces of the cube from step 3 at a rate of 15 rpm.
  
    This was done by sending an angle variable to the fragment shader representing the current angle of the texture and setting a bool value
    representing when the texture is rotating when the key is pressed. When rotated, a rotation is performed in the fragment shader about the pointer
    (0.5, 0.5) which is the center of the cube face.
    
  3. Use the 's' key to start and stop the continuous scrolling of the texture map on the cube in step 4. You will need to select a texture wrap
  mode so that the image repeats. 
  
    This was implemented by sending an offset variable to the fragment shader for the cube with the scrolling texture. The offset
    was simply added to the texture coordinates to produce the scrolling. To prevent infinite values, the offset was reset to 0 every time it reached 1.
    
    
