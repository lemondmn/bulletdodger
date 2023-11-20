# Bullet Dodger.

Artificial intelligence project for the eponymous subject at Instituto Tecnológico de Morelia.

This is a game that based on how a user plays (the training data), learns to play by itself through a neural network with the Synaptic JS library.

## Initializing.

- Install XAMPP (or LAMP, MAMP, WAMP, depending on OS).
- Clone this repo inside the `htdocs` folder or the respective folder for Apache to load websites.
- Open a web browser and go to `localhost/phaser` or your configured Apache website.

## Collecting training data (Playing in manual mode).

The game is simple, the only thing you have to do is to dodge the bullets that UFOs throw at you, either jumping or moving left or right depending on where the bullet is fired, the goal is to survive as long as possible.

For now, bullets only come from the right side and you only can perform the jump action.

The actions you can do are the following:

<table>
  <tr>
    <th style="width: 30%;">Key</th>
    <th style="width: 70%;">Action</th>
  </tr>
  <tr>
    <td>
      <kbd>SPACE</kbd>
    </td>
    <td>Jump</td>
  </tr>
  <tr>
    <td>
      <kbd>Esc</kbd>
    </td>
    <td>Pause (NYI)</td>
  </tr>
  <tr>
    <td>
      <kbd>A</kbd>
    </td>
    <td>Move Left (NYI)</td>
  </tr>
  <tr>
    <td>
      <kbd>D</kbd>
    </td>
    <td>Move Right (NYI)</td>
  </tr>
</table>

## Model training (Playing in auto mode).

Once you've collected enough training data (is recommended playing for one minute or more in manual mode), you may either die or press the pause (<kbd>Esc</kbd>) button to pause the game. Then from the pause menu, you can choose to play in manual mode or auto mode.

Choosing to play in auto mode will train the neural network to play by itself, using the data collected in your last run.

## Plotting training data in Python.

NYI.

## Troubleshooting.

Most basic problem is that the game is not working properly, you may do a hard reload of the game using <kbd>Ctrl</kbd> + <kbd>F5</kbd> key combination to reload the page and delete cache.

